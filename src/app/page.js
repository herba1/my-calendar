"use client";
import TaskCards from "@/app/components/task/TaskCards";
import TextAreaForm from "@/app/components/ui/textareaform";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState("loading"); // default | loading

  function setTaskStateProp(newState = "default") {
    setTaskState(newState);
  }

  const fetchTask = async () => {
    try {
      const response = await fetch("../../api/task/");
      if (!response.ok) {
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
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

  const calendarTask = tasks.map((task) => {
    let extra = {};
    if(task.is_completed){
      extra.textColor= "oklch(0.439 0 0)"


    }
    return {
      id: task.task_id,
      title: task.title,
      start: task.due_at,
      extendedProps:{
      description: task.description,
      },
      backgroundColor:
        task.priority === "high"
          ? "#ef4444" // red-500
          : task.priority === "medium"
          ? "oklch(0.795 0.184 86.047)" // amber-500
          : task.priority === "low"
          ? "oklch(0.723 0.219 149.579)" // blue-500
          : "#6b7280",
      ...extra,
    };
  });
  console.log(calendarTask);

  return (
    <div className=" h-full w-full flex flex-col ">
      <TextAreaForm
        tasks={tasks}
        setTaskState={setTaskState}
        taskState={taskState}
        handleTaskChange={handleTaskChange}
        setTaskStateProp={setTaskStateProp}
      ></TextAreaForm>
      <TaskCards
        handleTaskChange={handleTaskChange}
        tasks={tasks}
        taskState={taskState}
        setTaskState={setTaskState}
      ></TaskCards>
      <div className="w-dvw h-dvh flex justify-center items-center ">
        <div className=" w-full h-full max-w-6xl p-2 ">
          <FullCalendar
            height={700}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "today prev,next",
              center: "title",
              right: "dayGridMonth,timeGridDay",
            }}
            weekends={true}
            events={calendarTask}
            eventClick={(e)=>{
              console.log(e.event);
            }}
            nowIndicator={true}
            scrollTime={'08:00:00'}
          />
        </div>
      </div>
    </div>
  );
}
