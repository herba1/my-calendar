"use server";
import { GoogleGenAI } from "@google/genai";
// import { supabase } from "@/app/lib/supabase";
import { createClient } from "@/app/utils/supabase/server";
import { userAgent } from "next/server";

async function getGemini(
  message,
  tasks,
  uid,
  currentDateTime,
  userTimezone,
  prevMessage,
) {
  try {
    // console.log("getGemini");
    // console.log(tasks);
    console.log(currentDateTime);
    console.log(userTimezone);
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
      maxOutputTokens: 7000,
      responseMimeType: "application/json",
      systemInstruction: [
        {
          text: `Task Management Assistant - Smart Scheduler

You are an intelligent task parser that understands natural language and converts it into structured task data. You excel at understanding context, implicit timing, and user intent.

Output: [{method: "POST/PUT/DELETE", ...fields}] ONLY

Schema: due_at(timestamp UTC), title(text), is_completed(bool), priority(text), user_id(uuid)

INFO NEEDED: for PUT and DELETE always look at the task referred or inferred and use the taskid task_id to do the action respectivley.

CRITICAL TIMEZONE RULES:
- You receive Current time in UTC and user's timezone
- ALWAYS convert UTC to user's local time to understand what day/time it is for the user
- Example: If UTC is "2025-07-29T04:27:00Z" and timezone is "America/Los_Angeles":
  - UTC time: July 29, 4:27 AM
  - User's local time: July 28, 9:27 PM (UTC-7 for PDT)
  - So "today" = July 28, "tomorrow" = July 29
- When user says "today", use their LOCAL today, not UTC today
- All due_at outputs must be in UTC format (ending with 'Z')

TIME CONVERSION PROCESS:
1. Convert current UTC time to user's timezone to know their actual date/time
2. Parse user's request in their timezone context
3. Convert the scheduled time back to UTC for storage

INTELLIGENT TIME PARSING:
- Infer reasonable times from context (e.g., "lunch with Sarah" → 11:00pm, "morning standup" → 9:00am)
- Understand work patterns (meetings during business hours, personal tasks can be evenings/weekends)
- "tonight" means this evening, typically 1-3 hours from current time but use judgment
- For vague times, consider the task type: work tasks → business hours, entertainment → evening
- Multiple tasks mentioned together should be scheduled sequentially with smart spacing

CONTEXT AWARENESS:
- If user mentions "after X", schedule accordingly 
- Understand task dependencies ("prep for meeting then meeting" → prep comes first)
- Recognize recurring patterns without explicit times ("daily standup" → probably 8-10am)
- Consider task duration: quick tasks (calls) ~29min, meetings ~1hr, projects ~2hrs

NATURAL LANGUAGE UNDERSTANDING:
- "end the day with" → schedule late evening (8-11pm)
- "start with" → schedule early in available time
- "squeeze in" → find small gap or schedule tightly
- "when I get time" → low priority, flexible timing
- Understand urgency from tone, not just keywords

SMART DEFAULTS:
- Meals: breakfast(6-9am), lunch(12-1pm), dinner(6-8pm)
- Work tasks: prefer business hours unless specified
- Exercise: early morning or evening typically
- Entertainment/relaxation: evenings and weekends

TITLE GENERATION:
- Infer professional titles from casual input ("call Bob about the thing" → "Call Bob: Project discussion")
- Add context when available ("email" → "Send email: [topic if mentioned]")
- Group related items smartly ("buy milk, eggs" → "Grocery shopping: milk, eggs")

PRIORITY INTELLIGENCE:
- Deadlines mentioned → high priority
- "when I can" / "eventually" → low priority  
- Work during work hours → medium-high priority
- Personal tasks → medium unless urgent

Remember: You're helping someone organize their day. Be smart about timing, understand context, and create a schedule that makes sense for a real person.`,
        },
      ],
    };
    const model = "gemini-2.5-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `
            Context:
Tasks: ${JSON.stringify(tasks)}
UserID: ${uid}
Current: ${currentDateTime} UTC
Timezone: ${userTimezone || "America/Los_Angeles"}
Previous Message for Context {This previous message should be ignored if Request/Current message does no reference anything that may connect to it}: "${prevMessage}"
Request/Current Message: ${message}
            `,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    if (response && response.text) {
      console.log("Gemini response:", response.text);
      return response.text;
    } else {
      console.error("Unexpected response structure:", response);
      throw new Error("Invalid response structure from Gemini");
    }
  } catch (error) {
    console.error("Detailed AI processing error:", {
      message: error.message,
      stack: error.stack,
    });
    return JSON.stringify([
      { error: error.message || "Failed to process AI response" },
    ]);
  }
}

// should be built to switch between ai providers
export async function POST(request) {
  try {
    const supabase = await createClient();
    let {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user) {
      user = await supabase.auth.signInAnonymously();
      user = user.data.user;
    }
    let uid = user.id;
    const response = await supabase.from("usage").select("*");
    console.log(response);
    const usage = response.data[0];
    // create record if not existing
    if (!usage) {
      const { data, error } = await supabase.from("usage").insert({
        count: 1,
        timestamp: new Date().toISOString().split("T")[0],
        limit: user.is_anonymous ? 25 : 50,
      });
      if (error) {
        console.error(error);
        throw new Error("error making bucket record");
      }
      //if record exist
    } else if (usage) {
      // handle limits or reset first
      if (usage.count >= usage.limit) {
        // handle reset
        const dateDb = usage.timestamp;
        const date = new Date().toISOString().split("T")[0];
        if (date != dateDb) {
          const { error } = await supabase
            .from("usage")
            .update({
              count: 1,
              timestamp: new Date().toISOString().split("T")[0],
            })
            .eq("user_id", uid);
          if (error) {
            console.error(error);
            throw new Error("Unable to reset token usage");
          }
        } else {
          // token limit hit today
          console.log("Token Limit hit");
          return Response.json({
            data: {
              error: "Token limit hit for today",
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          });
        }
        // else increment token usage
      } else {
        const { data, error } = await supabase
          .from("usage")
          .update({ count: usage.count + 1 })
          .eq("user_id", uid);
        if (error) {
          throw new Error("Failure incresing token usage");
        }
      }
    }
    const body = await request.json();
    // setup for any ai provider
    console.log(body);
    const data = await getGemini(
      body.message,
      body.tasks,
      uid,
      body.currentDateTime,
      body.userTimezone,
      body.prevMessage,
    );
    const res = await parseTask(data);
    const resData = await res.json();
    console.log(res);
    console.log(resData);
    return Response.json({
      message: "Succesfully AI Processed ",
      status: 201,
      headers: { "Content-Type": "application/json" },
      data: resData.data,
    });
  } catch (e) {
    console.error(e);
    return Response.json({
      error: "Error getting AI provider",
      status: 501,
      headers: { "Content-Type": "application/json" },
      data: resData.data,
    });
  }
}

// this fnction will take an array of json and access DB
async function parseTask(text) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User could not be authenticated");
    }
    const uid = user.data.user.id;

    const tasks = await JSON.parse(text);
    let newTask = [];
    let deleted = 0;
    let modified = 0;
    for (const task of tasks) {
      if (task.error) {
        console.log(task.error);
        continue;
      }
      const { method, ...cleanTask } = task;

      // handle POST new task
      try {
        if (method === "POST") {
          const { data, error } = await supabase
            .from("task")
            .insert(cleanTask)
            .select();
          if (error) {
            console.error(error);
          } else {
            console.log("success creating task");
            newTask.push(cleanTask);
          }
        }
      } catch (error) {
        console.error(`error POST new task`);
        return Response.status(400).json({
          error,
          message: "Error during POST processing task",
        });
      }

      // handle DELETE task
      try {
        if (method === "DELETE") {
          const { data, error } = await supabase
            .from("task")
            .delete()
            .eq("task_id", cleanTask.task_id);
          if (error) {
            console.error(error);
          } else {
            console.log(`deleted task ${cleanTask.task_id}`);
            deleted += 1;
          }
        }
      } catch (error) {
        console.error(`error DELETE task`);
        return Response.status(400).json({
          error,
          message: "Error during DELETE processing task",
        });
      }

      // handle PUT task
      try {
        if (method === "PUT") {
          const { data, error } = await supabase
            .from("task")
            .update({ ...cleanTask })
            .eq("task_id", cleanTask.task_id);
          if (error) {
            console.error(error);
          } else {
            console.log(`deleted task ${cleanTask.task_id}`);
            modified += 1;
          }
        }
      } catch (error) {
        console.error(`error PUT task`);
        return Response.status(400).json({
          error,
          message: "Error during POST processing task",
        });
      }
    }
    return Response.json({
      message: "Processed Changes",
      status: 201,
      headers: { "Content-Type": "application/json" },
      data: { newTask, deleted, modified },
    });
  } catch (error) {
    console.error(`Error parsing new tasks: ${error}`);
    return Response.json({ error, message: "Server error" }, { status: 500 });
  }
}
