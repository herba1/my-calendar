"use client";
import TaskCards from "@/app/components/task/TaskCards";
import TextAreaForm from "@/app/components/ui/textareaform";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ListHeader from "../components/ui/listHeader";
import { Caladea } from "next/font/google";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState("loading"); // default | loading
  const [today, setToday] = useState();
  const [date, setDate] = useState({});
  const [listView, setListView] = useState(false);
  const calendar = useRef();

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

  useEffect(() => {
    if (!calendar.current) return;
    if (calendar.current) {
      const calendarAPI = calendar.current.getApi();
      const dateCal = new Date(calendarAPI.getDate());
      setDate({
        dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
        monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
        dayNumber: dateCal.getDate(), // 21
      });
      console.log(date);
    }
  }, []);

  const handleTaskChange = () => {
    fetchTask();
  };

  const calendarTask = tasks.map((task) => {
    let extra = {};
    if (task.is_completed) {
      extra.textColor = "oklch(0.439 0 0)";
    }
    return {
      id: task.task_id,
      title: task.title,
      start: task.due_at,
      extendedProps: {
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

  function changeDay(dateObject) {
    console.log(dateObject);
    const cal = calendar.current.getApi();
    cal.incrementDate(dateObject);
    const dateCal = new Date(cal.getDate());
    setDate({
      dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
      monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
      dayNumber: dateCal.getDate(), // 21
    });
    console.log(date);
  }

  return (
    <div className="relative mb-16">
      {/* this needs date */}
      <ListHeader className={`py-4`} />
      <button
        onClick={() => {
          changeDay({ day: 1 });
        }}
      >
        increment
      </button>
      <button
        onClick={() => {
          changeDay({ day: -1 });
        }}
      >
        decrement
      </button>
      <div className="bg-background-light/70 fixed bottom-0 z-10 w-full rounded-t-md shadow-2xs backdrop-blur-xs">
        <TextAreaForm
          tasks={tasks}
          setTaskState={setTaskState}
          taskState={taskState}
          handleTaskChange={handleTaskChange}
          setTaskStateProp={setTaskStateProp}
        ></TextAreaForm>
      </div>
      <TaskCards
        handleTaskChange={handleTaskChange}
        tasks={tasks}
        taskState={taskState}
        setTaskState={setTaskState}
      ></TaskCards>
      <div className="flex items-center justify-center">
        <div className="h-full w-full">
          <FullCalendar
            ref={calendar}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "today prev,next",
              center: "title",
              right: "dayGridMonth",
            }}
            weekends={true}
            events={calendarTask}
            eventClick={(e) => {
              console.log(e.event);
            }}
            nowIndicator={true}
            scrollTime={"08:00:00"}
          />
        </div>
      </div>
    </div>
  );
}
