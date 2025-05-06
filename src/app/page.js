
'use client'
import TaskCards from "@/app/components/task/TaskCards";
import TextAreaForm from "@/app/components/ui/textareaform";
import { useState,useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTask = async ()=>{
      try {
        const response = await fetch('../../api/task/');
        if(!response.ok){
          throw new Error(`response error ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (e) {
        console.error(e);
      }
  }

  // init
  useEffect(() => {
    fetchTask();
  }, []);

  const handleTaskChange = ()=>{
    fetchTask();
  }
  
  return (
    <div className=" h-full w-full flex flex-col ">
      <TextAreaForm handleTaskChange={handleTaskChange} ></TextAreaForm>
      <TaskCards handleTaskChange={handleTaskChange} tasks={tasks}></TaskCards>
    </div>
  );
}
