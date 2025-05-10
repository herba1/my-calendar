import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/app/lib/supabase";

async function getGemini(message) {
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
  
  At the TOP of the JSON make sure you add wether a DELETE method, or POST method, or PUT method based on language and like so method:method based on language you can assume most of the time it will be POST, if no task is found make an Error key value pair with explanation of not found
  if you return an error make sure its inside an array,
  todays date is ${new Date()}`,
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
  return response.text;
}

// should be built to switch between ai providers
export async function POST(request) {
  try {
    const body = await request.json();
    // setup for any ai provider 
    const data = await getGemini(body.message);
    const res = await parseTask(data);
    return Response.json(
      { message: "whats good" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return Response.json({ error: "error occured" }, { status: 501 });
  }
}

// this fnction will take an array of json and access DB
async function parseTask(text) {
  try {
    const tasks = await JSON.parse(text);
    for (const task of tasks) {
      if (task.error) {
        console.log(error);
        continue;
      }
      const { method, ...cleanTask } = task;
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
    }
    return Response.json(
      { message:"Success" },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error parsing new tasks: ${error}`);
    return Response.json({ error }, { status: 500 });
  }
}
