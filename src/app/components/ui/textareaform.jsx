"use client";
import { Button } from "./button";
import { Textarea } from "./textarea";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TextPlugin from "gsap/TextPlugin";
import { useReducer, useState, useRef, use } from "react";
import { toast } from "sonner";
import { array } from "zod";

gsap.registerPlugin(TextPlugin);

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
  const container = useRef(null);
  const [prevMessage, setPrevMessage] = useState("");

  function handleInput(e) {
    setInput(e.target.value);
    setInputSize(e.target.value.length);
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" && e.metaKey) || (e.key === "Enter" && e.ctrlKey))
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
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g., "America/Los_Angeles"
      const currentDateTime = new Date().toISOString();
      const response = await fetch("../../api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          // for now im sending entire tasks
          tasks: tasks,
          currentDateTime: currentDateTime,
          userTimezone: userTimezone,
          prevMessage: prevMessage,
        }),
      });
      const data = await response.json();
      console.log(data);
      console.log(data.error)
      setPrevMessage(input);
      let message = [];
      if (data.data) {
        if (data?.data?.newTask?.length > 0)
          message.push(`${data.data.newTask.length} Task Created`);
        if (data?.data?.deleted > 0)
          message.push(`${data.data.deleted} Task Removed `);
        if (data?.data?.modified > 0)
          message.push(`${data.data.modified} Task Modified`);
        if (data?.data?.error)
          message.push(`${data.data.error}, Come back tomorrow or msg me!`);
      }
      if (message.length === 0) {
        message.push("Something went wrong, try again.");
      }
      console.log(message);
      toast(message.join(", "));
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

  const { contextSafe } = useGSAP(
    () => {
      let dots = container.current.querySelectorAll(".dot");
      if (taskState === "loading") {
        gsap.killTweensOf(".dot");
        gsap.set(".dot", {
          display: "inline-block",
          yPercent: 100,
          opacity: 0,
          scale: 1,
        });
        gsap.to(".dot", {
          yPercent: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.1,
          onComplete: () => {
            dots.forEach((elem, i) => {
              gsap.to(elem, {
                yPercent: -100,
                scale: 1.1,
                ease: "power2.inOut",
                duration: 0.4,
                repeat: -1,
                yoyo: true,
                delay: i * 0.1,
              });
            });
          },
        });
      } else if (taskState == "default") {
        gsap.killTweensOf(".dot");
        gsap.to(".dot", {
          opacity: 0,
          scale: 1,
          yPercent: 0,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(".dot", { display: "none" });
          },
        });
      }
    },
    { scope: container.current, dependencies: [taskState] },
  );

  return (
    <form
      ref={container}
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
          <span className="align-text-bottom text-xs text-black/50">
            {inputSize}/500
          </span>
          <div className="inline-block space-x-1">
            <span className="dot inline-block aspect-square h-1.5 overflow-hidden rounded-full bg-black opacity-0"></span>
            <span className="dot inline-block aspect-square h-1.5 overflow-hidden rounded-full bg-black opacity-0"></span>
            <span className="dot inline-block aspect-square h-1.5 overflow-hidden rounded-full bg-black opacity-0"></span>
          </div>
          <Button
            disabled={taskState === "loading" || inputSize == 0}
            type="submit"
          >
            Go!
          </Button>
        </div>
      </div>
    </form>
  );
}
