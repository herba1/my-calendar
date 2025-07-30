"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import TaskCard from "./TaskCard";
import { Button } from "../ui/button";
import TaskCardSkeleton from "../skeleton/TaskCardSkeleton";
import { TaskCardsSkeleton } from "../skeleton/TaskCardSkeleton";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import SplitText from "gsap/SplitText";
import { ContentContainer } from "@fullcalendar/core/internal";
import { Split } from "lucide-react";

gsap.registerPlugin(Flip, SplitText);

export default function TaskCards({
  tasks,
  handleTaskChange,
  date,
  taskState,
}) {
  // CREATE A NEW TASK
  const container = useRef(null);
  const state = useRef(null);
  const [isFlip, setIsFlip] = useState(false);
  const [lastDate, setLastDate] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const { contextSafe } = useGSAP(
    () => {
      if (tasks.length > 0 && lastDate !== date) {
        Flip.killFlipsOf(".taskCard");
        gsap.set(".taskCard", { clearProps: "all" });
        setLastDate(date); // Update immediately to prevent re-runs
        let tween = gsap.from(".taskCard", {
          opacity: 0,
          scale: 0.9,
          yPercent: -70,
          duration: 0.5,
          ease: "power4.out",
          stagger: 0.07,
        });
      }
    },
    { scope: container.current, dependencies: [tasks, date] },
  );

  useGSAP(
    () => {
      if (tasks.length === 0 && taskState === "default" && isEmpty) {
        setIsEmpty(false);
        let split = SplitText.create(".emptyTaskMessage", {
          type: "lines,chars",
          mask: "lines",
        });
        gsap.set(".emptyTaskMessage", { opacity: 1 });
        gsap.fromTo(
          split.chars,
          {
            yPercent: -100,
            opacity: 0,
          },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.6,
            stagger: 0.01,
            ease: "power1.out",
            onComplete: () => {
              split.revert();
            },
          },
        );
      }
    },
    { scope: container.current, dependencies: [taskState, date] },
  );

  // PUT task to update send object of updated tast and task id
  const handleComplete = contextSafe(async (task_id, is_completed) => {
    try {
      // gsap flip logic
      state.current = Flip.getState(".taskCard");
      setIsFlip(true);
      const response = await fetch("../../api/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: task_id,
          is_completed: !is_completed,
        }),
      });
      if (!response.ok) {
        throw new Error(`response:${response.status}`);
      }
      handleTaskChange();
    } catch (error) {
      console.error(error);
    }
  });

  //  DELETE function
  const handleDelete = contextSafe(async (taskId) => {
    try {
      // flip setup
      state.current = Flip.getState(".taskCard");
      setIsFlip(true);
      const response = await fetch("../../api/task", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId }),
      });
      if (!response.ok) {
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      handleTaskChange();
    } catch (e) {
      console.error(`${e}`);
    }
  });

  // trigger flip form last state
  useGSAP(() => {
    if (isFlip) {
      Flip.from(state.current, {
        ease: "power4.out",
        absolute:true,
        absoluteOnLeave:true,
        onComplete: () => {
          setIsFlip(false);
        },
      });
    }
  }, {dependencies:[tasks]});

  // list sort, time -> completed
  let sortedTask = [...tasks].sort((a, b) => {
    return new Date(a.due_at) - new Date(b.due_at);
  });

  sortedTask = sortedTask.sort((a, b) => {
    return a.is_completed - b.is_completed;
  });
  // create my task list to render
  let tasksCards = sortedTask.map((task) => {
    return (
      <TaskCard
        // loading={loading}
        className="taskCard"
        handleDelete={handleDelete}
        handleComplete={handleComplete}
        is_completed={task.is_completed}
        priority={task.priority}
        key={task.task_id}
        title={task.title}
        desc={task.description}
        dateDue={task.due_at}
        dateCreated={task.created_at}
        tags={task.tags}
        id={task.task_id}
      ></TaskCard>
    );
  });

  return (
    <div
      ref={container}
      className={`cards-container flex flex-col items-center justify-center gap-4 overflow-x-clip p-2 *:lst:mb-64 lg:*:last:mb-0`}
    >
      {tasksCards.length ? (
        tasksCards
      ) : (
        <span
          className={`emptyTaskMessage ${isEmpty ? "opacity-0" : "opacity-100"} my-32 inline-block h-full text-black/60`}
        >
          No task here... try making one!
        </span>
      )}
      <div className="h-64 lg:hidden"></div>
    </div>
  );
}
