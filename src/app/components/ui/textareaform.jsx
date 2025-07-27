"use client";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { useReducer, useState, useRef} from "react";

export default function TextAreaForm({
  handleTaskChange,
  taskState,
  setTaskStateProp,
  tasks,
  className,
  children,
}) {
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(0);
  const textArea = useRef(null);

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
    let relevantTask = tasks.map((task) => {
      return {
        task_id: task.task_id,
        created_at: task.created_at,
        title: task.title,
        due_at: task.due_at,
      };
    });
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
          currentDateTime: `${new Date().toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`,
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
    <form
      action={"#"}
      onSubmit={handleSubmit}
      className={`w-full p-2 ${className} `}
    >
      <div
        onClick={() => {
          textArea.current.focus();
        }}
        className={`rounded-lg border-2 bg-white p-2 transition-all focus-within:ring-2 hover:cursor-text lg:p-4`}
      >
        <Textarea
          ref={textArea}
          placeholder={
            "Tell me about your plans here (appointments, task, important dates). "
          }
          className={`scroll max-h-80 resize-none border-none shadow-none outline-none focus-visible:ring-0`}
          maxLength="500"
          value={input}
          onChange={handleInput}
          disabled={taskState === "loading"}
          onKeyDown={handleKeyDown}
        ></Textarea>
        <div className="bottom flex items-center justify-between">
          <div>
            <span className="align-text-bottom text-xs text-black/50">
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
