import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/app/lib/supabase";

async function getGemini(message, tasks) {
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
  based on this schema create a json, and i assert that you only reply in json based on the schema and based on me talking about what i have to do, if no task is found you may return empty json object, try to create maningful task however based on my thoghts even if it may seem minor it could be important, tags shoudl be only strings and use no delimters. Tags should not be delimited and simply be strings

  currentTask:${JSON.stringify(tasks)}
  
  At the TOP of the JSON make sure you add wether a DELETE method, or POST method, or PUT method based on language and like so method:method based on language you can assume most of the time it will be POST, if no task is found make an Error key value pair with explanation of not found
  make sure all responses even if 1 item(TASK/object) is inside an array, however each task shoudl but its own object,
  todays date is ${new Date()} for reference,
  For delete or post figure out witch tasks form currentTask list is relevant and provide the wanted method along with the task_id, for post include the fields to be updated, return NO task_id for new task
  When responding what i mean by array is that the tasks and methods are within 1 arry so every response no matter will be [{task and methods here}]
  like this :[{//task and method here},{...repeat}],
  exaclty like that no extra labels or information, never add any other text no matter what the input is alawys respond with these guidelines.

  
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
    const body = await request.json();
    console.log(`body tasks`, body.tasks);
    // setup for any ai provider
    const data = await getGemini(body.message, body.tasks);
    const res = await parseTask(data);
    return Response.json(
      { message: "Succesfully AI Processed " },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Error getting AI provider" }, { status: 501 });
  }
}

// this fnction will take an array of json and access DB
async function parseTask(text) {
  try {
    const tasks = await JSON.parse(text);
    console.log("unprocessed task");
    for (const task of tasks) {
      console.log(task);
      if (task.error) {
        console.log(error);
        continue;
      }
      const { method, ...cleanTask } = task;

      // handle POST new task
      try {
        if (method === "POST") {
          console.log(`new task:`);
          console.log(cleanTask);
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
            .eq('task_id',cleanTask.task_id);
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
            .update({ ...cleanTask})
            .eq('task_id',cleanTask.task_id);
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
