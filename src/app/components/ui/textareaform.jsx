"use client";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { useState } from "react";

export default function TextAreaForm({
  handleTaskChange,
  taskState,
  setTaskStateProp,
  tasks,
  className,
  children
}) {
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(0);

  function handleInput(e) {
    setInput(e.target.value);
    setInputSize(e.target.value.length);
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" && e.metaKey) || e.ctrlKey)
      e.target.form.requestSubmit();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTaskStateProp("loading");
    // for now im sending entire tasks not relevant task
    let relevantTask = tasks.map(task=>{
      return{
        task_id:task.task_id,
        created_at:task.created_at,
        title:task.title,
        due_at:task.due_at,
      }
    })
    try {
      const response = await fetch("../../api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          // for now im sending entire tasks
          tasks: tasks,
        }),
      });
      const data = await response.json();
      console.log(data);
      setTaskStateProp("default");
      setInput("");
      setInputSize(0);
      handleTaskChange();
    } catch (e) {
      console.error(e);
      setTaskStateProp("default");
      setInput("");
      setInputSize(0);
    }
  }

  return (
    <form action={"#"} onSubmit={handleSubmit} className={` w-full p-2  ${className} `}>
      <div
        className={`transition-all bg-white focus-within:ring-2 border-2 rounded-lg p-4`}
      >
        <Textarea
          placeholder={
            "Tell me about your plans here (appointments, task, important dates). "
          }
          className={`border-none outline-none shadow-none focus-visible:ring-0 resize-none max-h-80 scroll`}
          maxLength="500"
          value={input}
          onChange={handleInput}
          disabled={taskState === "loading"}
          onKeyDown={handleKeyDown}
        ></Textarea>
        <div className="bottom flex justify-between items-center">
          <div>
            <span className="text-xs align-text-bottom text-black/50">
              {inputSize}/500
            </span>
          </div>
          <Button
            disabled={taskState === "loading" || inputSize == 0}
            type="submit"
          >
            {taskState === "loading" ? "One sec..." : "Go!"}
          </Button>
        </div>
      </div>
    </form>
  );
}
