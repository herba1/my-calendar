"use client";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "./button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

export default function DateChanger({
  className,
  changeDay,
  changeDayToday,
  date,
  isToday,
}) {
  const button = useRef(null);
  const [first, setFirst] = useState(false);
  useGSAP(
    () => {
      if (!isToday) {
        gsap.killTweensOf(button.current);
        gsap.fromTo(
          button.current,
          {
            display:'inline-block',
            yPercent: 50,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power4.out",
            onComplete: () => setFirst(true),
          },
        );
      } else if (isToday && first) {
        gsap.killTweensOf(button.current);
        gsap.fromTo(
          button.current,
          { yPercent: 0, opacity: 1 },
          {
            yPercent: 50,
            opacity: 0,
            ease: "power4.out",
            display: "none",
          },
        );
      }
    },
    { dependencies: [isToday] },
  );
  let buttonClassName = ` active:opacity-80 active:scale-95 transition-all ease-out-3  hover:opacity-80 touch-manipulation bg-white p-1 rounded-md inline-block outline-black/10 outline-2 shadow-md `;
  return (
    <div
      className={`relative flex items-center justify-between gap-2 ${className} `}
    >
      {1 ? (
        <Button
          ref={button}
          onClick={() => {
            changeDayToday();
          }}
          className={`absolute bottom-full left-1/2 hidden z-10 -translate-x-1/2 touch-manipulation opacity-0 shadow-md backdrop-blur-md`}
        >
          Return to Today
        </Button>
      ) : null}
      <div className="flex gap-2">
        <button
          className={` ${buttonClassName}`}
          type="button"
          onClick={() => {
            changeDay({ month: -1 });
          }}
        >
          <ChevronsLeft size={24} />
        </button>
        <button
          className={`${buttonClassName}`}
          type="button"
          onClick={() => {
            changeDay({ day: -1 });
          }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <h2 className="text-h5 tracking-snug tracking-tighter  max-w-fit text-center">{`${date.monthName ? date.monthName.slice(0, 3) : ""} ${date.dayNumber ? date.dayNumber : ""} ${date.year ? date.year : ""}`}</h2>
      <div className="flex gap-2">
        <button
          className={`${buttonClassName}`}
          type="button"
          onClick={() => {
            changeDay({ day: 1 });
          }}
        >
          <ChevronRight size={24} />
        </button>
        <button
          className={`${buttonClassName}`}
          type="button"
          onClick={() => {
            changeDay({ month: 1 });
          }}
        >
          <ChevronsRight size={24} />
        </button>
      </div>
    </div>
  );
}
