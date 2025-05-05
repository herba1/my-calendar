"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import clsx from "clsx";
import formatDateMonthDayTime from "@/app/lib/dateString";

export default function TaskCard({
  priority = "medium",
  title = "Some Task",
  desc = "No description",
  dateDue = "No Date",
  dateCreated,
  id,
  handleDelete,
  handleComplete,
  is_completed=false,
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
    <Card className={clsx(`w-70 p-5 flex flex-col`, is_completed?' bg-green-100 ':'' )}>
      <CardTitle className={`text-xl`}>{title}</CardTitle>
      <CardContent>{desc}</CardContent>
      <CardDescription className={`flex flex-col gap-1`}>
        <Badge className={` ${badgeClassName} `}>{priority}</Badge>
        <span>Due:{formatDateMonthDayTime(new Date(dateDue))}</span>
        <span>Created:{formatDateMonthDayTime(new Date(dateCreated))}</span>
      </CardDescription>
      <CardFooter
        className={` flex justify-between w-full  p-0 self-end text-nowrap`}
      >
        <Button variant={"destructive"} onClick={() => handleDelete(id)}>
          Remove
        </Button>
        <Button variant={"default"} onClick={() => handleComplete(id,is_completed)}>
          Complete
        </Button>
      </CardFooter>
    </Card>
  );
}