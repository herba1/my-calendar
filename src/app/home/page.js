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
import DateChanger from "../components/ui/dateChanger";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState("loading"); // default | loading
  const [date, setDate] = useState({});
  const [time, setTime] = useState(
    `${new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`,
  );
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

  // set calendar
  useEffect(() => {
    if (!calendar.current) return;
    if (calendar.current) {
      const calendarAPI = calendar.current.getApi();
      const dateCal = new Date(calendarAPI.getDate());
      setDate({
        dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
        monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
        year: dateCal.toLocaleDateString("en-US", { year: "numeric" }), // "July"
        dayNumber: dateCal.getDate(), // 21
      });
    }
  }, []);

  // time clock setter
  useEffect(() => {
    function newTime() {
      setTime(
        `${new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`,
      );
      console.log(time);
    }
    let id = setInterval(() => {
      newTime();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  });

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

  function changeDay(dateObject) {
    const cal = calendar.current.getApi();
    cal.incrementDate(dateObject);
    const dateCal = new Date(cal.getDate());
    setDate({
      dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
      monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
      year: dateCal.toLocaleDateString("en-US", { year: "numeric" }), // "July"
      dayNumber: dateCal.getDate(), // 21
    });
  }

  function changeDayToday() {
    const cal = calendar.current.getApi();
    cal.today();
    const dateCal = new Date(cal.getDate());
    setDate({
      dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
      monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
      year: dateCal.toLocaleDateString("en-US", { year: "numeric" }), // "July"
      dayNumber: dateCal.getDate(), // 21
    });
  }

  return (
    <div className="relative mb-16">
      {/* this needs date */}
      <ListHeader date={date} time={time} className={`py-4`} />
      <DateChanger changeDay={changeDay} changeDayToday={changeDayToday} date={date} />
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
