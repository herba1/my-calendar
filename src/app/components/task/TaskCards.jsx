"use client";
import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { Button } from "../ui/button";
import TaskCardSkeleton from "../skeleton/TaskCardSkeleton";
import { TaskCardsSkeleton } from "../skeleton/TaskCardSkeleton"

export default function TaskCards({ tasks, handleTaskChange, taskState, setTaskStateProp }) {

  // CREATE A NEW TASK
  async function handleSubmit(e) {
    try {
      const response = await fetch("../../api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "this was submitted" }),
      });
      if (!response.ok) {
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      console.log(`data at client ${data}`);
      handleTaskChange();
    } catch (e) {
      console.error(`e`);
    }
  }

  // PUT task to update send object of updated tast and task id
  async function handleComplete(task_id, is_completed) {
    try {
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
  }

  // create my task list to render
  let tasksCards = tasks.map((task) => {
    return (
      <TaskCard
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

  //  delete function
  async function handleDelete(taskId) {
    try {
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
  }

  return (
    <div className={`cards-container gap-5 flex flex-wrap justify-center `}>
      {/* <Button onClick={handleSubmit}>submit</Button> */}
      {taskState === "loading" && <TaskCardsSkeleton></TaskCardsSkeleton>}
      {tasksCards}
    </div>
  );
}
