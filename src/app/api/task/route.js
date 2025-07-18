// import { supabase } from "@/app/lib/supabase";
import { createClient } from "@/app/utils/supabase/server";

// get all task
export async function GET() {
  const supabase = await createClient()
  const {data, error} = await supabase.auth.getUser();
  try {
    // RLS policy filters users task
    const { data, error } = await supabase.from("task").select("*");
    if (data) {
    }
    return Response.json(data);
  } catch (e) {
    console.error(e, error);
    return Response.json({ error: error });
  }
}

// will have to change to poast many based on schema and linked to AI
export async function POST(request) {
  const supabase = await createClient()
  try {
    // should take in new task
    const newTask = await request.json();
    console.log(`new task:`);
    console.log(newTask);
    const { data, error } = await supabase
      .from("task")
      .insert(newTask)
      .select();
    if (error) {
      console.error(error);
      throw new Error(error);
    }

    return Response.json(
      { data, error },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Caught error:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const supabase = await createClient()
  try {
    const body = await request.json();
    console.log(body);
    const task_id = body.task_id;
    const { data, error } = await supabase
      .from("task")
      .delete()
      .eq("task_id", task_id);
    return Response.json({ message: "" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 503 });
  }
}

export async function PUT(request) {
  const supabase = await createClient()
  try {
    const body = await request.json();
    console.log(`PUT:${body}`);
    console.log(body);
    const task_id = body.task_id;
    const is_completed = body.is_completed;
    const { data, error } = await supabase
      .from("task")
      .update({ ...body })
      .eq("task_id", task_id);
    return Response.json({ data, error }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: e, message: "Error PUT task" },
      { status: 503 }
    );
  }
}
