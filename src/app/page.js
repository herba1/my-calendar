"use client";
import TaskCards from "@/app/components/task/TaskCards";
import TextAreaForm from "@/app/components/ui/textareaform";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState("loading"); // default | loading

  function setTaskStateProp(newState="default"){
    setTaskState(newState);
  }

  const fetchTask = async () => {
    try {
      const response = await fetch("../../api/task/");
      if (!response.ok) {
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setTaskState("default");
    } catch (e) {
      console.error(e);
    }
  };

  // init
  useEffect(() => {
    fetchTask();
  }, []);

  const handleTaskChange = () => {
    fetchTask();
  };

  return (
    <div className=" h-full w-full flex flex-col ">
      <TextAreaForm tasks={tasks} setTaskState={setTaskState} taskState={taskState} handleTaskChange={handleTaskChange} setTaskStateProp={setTaskStateProp}></TextAreaForm>
      <TaskCards
        handleTaskChange={handleTaskChange}
        tasks={tasks}
        taskState={taskState}
        setTaskState={setTaskState}
      ></TaskCards>
    </div>
  );
}
