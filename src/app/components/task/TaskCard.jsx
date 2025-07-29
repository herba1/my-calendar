"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import clsx from "clsx";
import formatDateMonthDayTime from "@/app/lib/dateString";
import { Check, Trash2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function TaskCard({
  loading,
  className = "",
  priority = "medium",
  title = "Some Task",
  desc = "No description",
  dateDue = "No Date",
  dateCreated,
  id,
  handleDelete,
  handleComplete,
  is_completed = false,
  tags,
}) {
  const container = useRef(null);
  const { conextSafe } = useGSAP(() => {}, {
    scope: container.current,
    dependencies: [loading],
  });

  let badgeClassName = "";
  if (priority === "low") {
    badgeClassName = " bg-green-500 ";
  } else if (priority === "high") {
    badgeClassName = " bg-red-500 ";
  } else {
    badgeClassName = " bg-yellow-500 ";
  }

  return (
    <Card
      ref={container}
      className={clsx(
        `flex w-full flex-col ${badgeClassName} ${loading ? " animate-pulse opacity-50" : ""} gap-6 p-2 text-white ${className}`,
        is_completed ? "saturate-0" : "",
      )}
    >
      <header className="flex items-center justify-between">
        <h2
          className={`text-h5 tracking-snug max-w-3/4 leading-tight font-bold`}
        >
          {title}
        </h2>
        <p>
          {new Date(dateDue)
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            .toLowerCase()}
        </p>
      </header>
      {/* <p>{desc}</p> */}
      <footer className="card__footer flex items-center justify-between">
        <span className="text-xs">
          Created:{formatDateMonthDayTime(new Date(dateCreated))}
        </span>
        <div className="inline-block space-x-1">
          <span className="dot inline-block aspect-square h-1.5 overflow-hidden rounded-full bg-white opacity-0"></span>
          <span className="dot inline-block aspect-square h-1.5 overflow-hidden rounded-full bg-white opacity-0"></span>
          <span className="dot inline-block aspect-square h-1.5 overflow-hidden rounded-full bg-white opacity-0"></span>
        </div>
        <div className="button__container flex gap-1">
          <button
            className="ease-elastic-wild touch-manipulation p-1 transition-all duration-200 hover:scale-105 hover:rotate-12 active:scale-90 active:rotate-3 active:opacity-50"
            onClick={() => handleDelete(id)}
          >
            <Trash2 size={24} />
          </button>
          <button
            className="ease-elastic-wild touch-manipulation p-1 transition-all duration-200 hover:scale-105 hover:-rotate-12 active:scale-90 active:rotate-3 active:opacity-50"
            onClick={() => handleComplete(id, is_completed)}
          >
            <Check size={24} />
          </button>
        </div>
      </footer>
    </Card>
  );
}
