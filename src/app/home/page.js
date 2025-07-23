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
import NavMobile from "../components/NavMobile";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState("loading"); // default | loading
  const [isToday, setIsToday] = useState(true);
  const [date, setDate] = useState({});
  const [time, setTime] = useState(
    `${new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`,
  );
  const [altView, setAltView] = useState(false);
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
        today: dateCal.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        currentDate: dateCal.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
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

  useEffect(() => {
    if (date.today == date.currentDate) {
      setIsToday(true);
    } else setIsToday(false);
  }, [date]);

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

  const dayTask = tasks.filter((task) => {
    console.log(task);
    let extra = {};
    const curTaskDate = new Date(task.due_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return curTaskDate == date.currentDate;
  });
  console.log(dayTask);

  function changeDay(dateObject) {
    const cal = calendar.current.getApi();
    cal.incrementDate(dateObject);
    const dateCal = new Date(cal.getDate());
    setDate({
      ...date,
      dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
      monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
      year: dateCal.toLocaleDateString("en-US", { year: "numeric" }), // "July"
      dayNumber: dateCal.getDate(), // 21
      currentDate: dateCal.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    });
  }

  function changeDayToday() {
    const cal = calendar.current.getApi();
    cal.today();
    const dateCal = new Date(cal.getDate());
    setDate({
      ...date,
      dayName: dateCal.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
      monthName: dateCal.toLocaleDateString("en-US", { month: "long" }), // "July"
      year: dateCal.toLocaleDateString("en-US", { year: "numeric" }), // "July"
      dayNumber: dateCal.getDate(), // 21
      currentDate: dateCal.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    });
  }

  return (
    <div className="relative h-svh max-h-fit min-h-svh gap-4 lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:pt-16">
      <NavMobile
        className={`lg:hidden`}
        altView={altView}
        setAltView={setAltView}
      />
      {/* this needs date */}
      {/* <DateChanger changeDay={changeDay} changeDayToday={changeDayToday} date={date} /> */}
      <div
        className={`row-span-full ${!altView ? "" : "hidden lg:inline-block"} lg:bg-background-light relative col-span-3 col-start-3 self-stretch rounded-md`}
      >
        <ListHeader
          taskSize={dayTask.length}
          date={date}
          time={time}
          className={`sticky top-0 py-4`}
        />
        <TaskCards
          handleTaskChange={handleTaskChange}
          tasks={dayTask}
          taskState={taskState}
          setTaskState={setTaskState}
        ></TaskCards>
      </div>
      <div
        className={`row-span-full h-4/5 lg:h-full lg:max-h-full lg:flex-col lg:max-w-full ${altView ? "" : "hidden lg:flex"} bg-background-light col-span-5 rounded-md p-2`}
      >
        <DateChanger
          changeDay={changeDay}
          changeDayToday={changeDayToday}
          date={date}
          className={`m-2 hidden lg:flex`}
          isToday={isToday}
        />
        <div className="h-full max-h-full w-full">
          <FullCalendar
            ref={calendar}
            plugins={[dayGridPlugin, timeGridPlugin]}
            dayMaxEvents={2}
            initialView="dayGridMonth"
            height={"100%"}
            headerToolbar={false}
            weekends={true}
            events={calendarTask}
            eventClick={(e) => {
              console.log(e.event);
            }}
            nowIndicator={true}
            scrollTime={"08:00:00"}
          />
          <div className="h-50 lg:hidden"></div>
        </div>
      </div>
      <div className="bg-background-light/90 fixed bottom-0 z-10 col-span-8 col-start-3 max-h-fit w-full rounded-t-md shadow-md backdrop-blur-xs lg:static lg:mb-12 lg:inline-block">
        <DateChanger
          changeDay={changeDay}
          changeDayToday={changeDayToday}
          date={date}
          className={`m-2 lg:hidden`}
          isToday={isToday}
        />
        <TextAreaForm
          tasks={tasks}
          setTaskState={setTaskState}
          taskState={taskState}
          handleTaskChange={handleTaskChange}
          setTaskStateProp={setTaskStateProp}
        ></TextAreaForm>
      </div>
    </div>
  );
}
