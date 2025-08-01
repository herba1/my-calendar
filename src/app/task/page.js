"use client";
import TaskCards from "@/app/components/task/TaskCards";
import TextAreaForm from "@/app/components/ui/textareaform";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ListHeader from "../components/ui/listHeader";
import { Caladea } from "next/font/google";
import DateChanger from "../components/ui/dateChanger";
import NavMobile from "../components/NavMobile";
import gsap from "gsap";
import Flip from "gsap/Flip";
gsap.registerPlugin(Flip);
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
      setTaskState("loading");
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

  const handleTaskChangeNoState = async () => {
    try {
      const response = await fetch("../../api/task/");
      if (!response.ok) {
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      // No taskState change needed - we never set it to loading
    } catch (e) {
      console.error(e);
    }
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
        task.priority.toLowerCase() === "high"
          ? "#ef4444" // red-500
          : task.priority.toLowerCase() === "medium"
            ? "oklch(0.795 0.184 86.047)" // amber-500
            : task.priority.toLowerCase() === "low"
              ? "oklch(0.723 0.219 149.579)" // blue-500
              : "#6b7280",
      ...extra,
    };
  });

  const dayTask = tasks.filter((task) => {
    let extra = {};
    const curTaskDate = new Date(task.due_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return curTaskDate == date.currentDate;
  });

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

  function changeDayTo(dateObject) {
    const cal = calendar.current.getApi();
    cal.gotoDate(dateObject);
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
    setAltView(false);
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
    <div className="relative h-svh max-h-fit min-h-svh gap-4 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-6 lg:grid-rows-2 lg:px-4 lg:pt-16">
      <NavMobile
        className={`z-20 lg:hidden`}
        altView={altView}
        setAltView={setAltView}
      />
      {/* this needs date */}
      {/* <DateChanger changeDay={changeDay} changeDayToday={changeDayToday} date={date} /> */}
      <div
        className={`row-span-full ${!altView ? "" : "hidden lg:block"} lg:bg-background-light scroll relative col-span-2 w-full rounded-md lg:self-stretch lg:overflow-y-auto`}
      >
        <ListHeader
          taskSize={dayTask.length}
          taskState={taskState}
          date={date}
          time={time}
          className={`lg:bg-background-light/90 z-10 w-full rounded-md border-b-2 border-black/10 py-4 backdrop-blur-md lg:sticky lg:top-0`}
        />
        <TaskCards
          date={date}
          handleTaskChange={handleTaskChangeNoState}
          taskState={taskState}
          tasks={dayTask}
        ></TaskCards>
      </div>
      <div
        className={`row-span-full h-4/5 lg:h-full lg:max-h-full lg:max-w-full lg:flex-col ${altView ? "" : "hidden lg:flex"} lg:bg-sidebar col-span-4 rounded-md p-2`}
      >
        <DateChanger
          changeDay={changeDay}
          changeDayToday={changeDayToday}
          date={date}
          className={`m-2 hidden lg:flex`}
          isToday={isToday}
        />
        <div className="h-full max-h-full w-full calendar-container">
          <FullCalendar
            ref={calendar}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            dayMaxEvents={2}
            initialView="dayGridMonth"
            height={"100%"}
            aspectRatio={1.35}
            fixedWeekCount={true}
            headerToolbar={false}
            weekends={true}
            events={calendarTask}
            dateClick={(e) => {
              changeDayTo(e.date);
            }}
            dayCellClassNames={(info) => {
              const cellDate = info.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              });
              return cellDate === date.currentDate ? "fc-day-selected" : "";
            }}
            nowIndicator={true}
            scrollTime={"08:00:00"}
          />
          <div className="h-50 lg:hidden"></div>
        </div>
      </div>
      <div className="bg-sidebar/90 fixed bottom-0 z-10 col-span-6 col-start-0 max-h-fit w-full rounded-t-md shadow-md backdrop-blur-xs md:pr-14 lg:static lg:mb-12 lg:inline-block lg:w-full lg:rounded-md lg:pr-0">
        <DateChanger
          changeDay={changeDay}
          changeDayToday={changeDayToday}
          date={date}
          className={`px-2 lg:hidden`}
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
