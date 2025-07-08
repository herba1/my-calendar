"use server";
import { GoogleGenAI } from "@google/genai";
// import { supabase } from "@/app/lib/supabase";
import { createClient } from "@/app/utils/supabase/server";
import { userAgent } from "next/server";

async function getGemini(message, tasks, uid) {
  try {
    // console.log("getGemini");
    // console.log(tasks);
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
      maxOutputTokens: 1000,
      responseMimeType: "application/json",
      systemInstruction: [
        {
          text: `created_at timestamp with time zone null default now(),
  due_at timestamp with time zone null,
  title text not null default 'Unnamed Task'::text,
  description text null,
  tags json null,
  is_completed boolean not null default false,
  is_recurring boolean not null default false,
  priority text not null default 'medium'::text,
  user_id is the current authenticated users id, never change this ID no matter what always make sure it is as you receive it, should u somehow not get anything just leave it null
  !NEVER change a task_id
  based on this schema create a json, and i assert that you only reply in json based on the schema and based on me talking about what i have to do, if no task is found you may return empty json object, try to create maningful task however based on my thoghts even if it may seem minor it could be important, tags shoudl be only strings and use no delimters. Tags should not be delimited and simply be strings

  currentTask:${JSON.stringify(tasks)}
  currentUserID:${uid}
  
  At the TOP of the JSON make sure you add wether a DELETE method, or POST method, or PUT method based on language and like so method:method based on language you can assume most of the time it will be POST, if no task is found make an Error key value pair with explanation of not found
  make sure all responses even if 1 item(TASK/object) is inside an array, however each task shoudl but its own object,
  todays date is ${new Date()} for reference,
  For delete or post figure out witch tasks form currentTask list is relevant and provide the wanted method along with the task_id, for post include the fields to be updated, return NO task_id for new task
  When responding what i mean by array is that the tasks and methods are within 1 arry so every response no matter will be [{task and methods here}]
  like this :[{//task and method here},{...repeat}],
  exaclty like that no extra labels or information, never add any other text no matter what the input is always respond with these guidelines.
  `,
        },
      ],
    };
    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${message}`,
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
      return response.text;
    } else {
      throw new Error("Invalid or bad response from AI");
    }
  } catch (error) {
    console.error("AI processing error:", error);
    return JSON.stringify([{ error: "Failed to process ai response" }]);
  }
}

// should be built to switch between ai providers
export async function POST(request) {
  try {
    const supabase = await createClient();
    // let user = await supabase.auth.getUser();
    let {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log(user);
    if (!user) {
      user = await supabase.auth.signInAnonymously();
      user = user.data.user;
    }
    let uid = user.id;
    const response = await supabase.from("usage").select("*");
    const usage = response.data[0];
    // create record if not existing
    if (!usage) {
      const { data, error } = await supabase.from("usage").insert({
        count: 1,
        timestamp: new Date().toISOString().split("T")[0],
        limit: user.is_anonymous ? 25 : null,
      });
      if (error) {
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
          return Response.json(
            { message: "Token limit hit for today" },
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
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
    const data = await getGemini(body.message, body.tasks, uid);
    const res = await parseTask(data);
    return Response.json(
      { message: "Succesfully AI Processed " },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Error getting AI provider" },
      { status: 501 }
    );
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
    for (const task of tasks) {
      if (task.error) {
        console.log(error);
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
    return Response.json(
      { message: "Processed Changes" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error parsing new tasks: ${error}`);
    return Response.json({ error, message: "Server error" }, { status: 500 });
  }
}
