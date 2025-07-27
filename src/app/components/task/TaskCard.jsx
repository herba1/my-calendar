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

export default function TaskCard({
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
      className={clsx(
        `flex w-full flex-col ${badgeClassName} gap-6 p-2 text-white ${className}`,
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
          {new Date(dateDue).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).toLowerCase()}
        </p>
      </header>
      {/* <p>{desc}</p> */}
      <div className="card__footer flex justify-between items-center">
        <span className="text-xs">
          Created:{formatDateMonthDayTime(new Date(dateCreated))}
        </span>
        <div className="button__container flex gap-1">
          <button className=" touch-manipulation p-1" onClick={() => handleDelete(id)}>
            <Trash2 size={24} />
          </button>
          <button className=" touch-manipulation p-1" onClick={() => handleComplete(id, is_completed)}>
            <Check size={24} />
          </button>
        </div>
      </div>
    </Card>
  );
}
