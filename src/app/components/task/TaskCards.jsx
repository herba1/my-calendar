"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { supabase } from "../../lib/supabase";
import { Badge } from "../ui/badge";
import clsx from "clsx";


function TaskCard({
  priority = "medium",
  title = "Some Task",
  desc = "No description",
  dateDue = "No Date",
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
      <CardTitle className={`text-xl`}>{title + id}</CardTitle>
      <CardContent>{desc}</CardContent>
      <CardDescription className={`flex flex-col gap-1`}>
        <Badge className={` ${badgeClassName} `}>{priority}</Badge>
        <span>date due:{dateDue}</span>
        <span>date created:{dateDue}</span>
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

export default function TaskCards() {
  const [currentTask, setCurrentTask] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // INITIALIZE DATA
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('../../api/task/');
        if(!response.ok){
          throw new Error(`response error ${response.status}`);
        }
        const data = await response.json();
        setCurrentTask(data);

      } catch (e) {
        console.error(e);
      }
    }
    getData();
  }, [refreshTrigger]);


  // CREATE A NEW TASK
  async function handleSubmit(e){
    try{
      const response = await fetch('../../api/task',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title:'this was submitted'}),
      });
      if(!response.ok){
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      console.log(`data at client ${data}`)
      setRefreshTrigger(refreshTrigger+1)
    }
    catch(e){
      console.error(`e`)
    }

  }

  // PUT task to update send object of updated tast and task id
  async function handleComplete(task_id,is_completed) {
    try{
      const response = await fetch('../../api/task',{
        method:'PUT',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id:task_id,
          is_completed:!is_completed,
        })
      })
      if(!response.ok){throw new Error(`response:${response.status}`)}
      setRefreshTrigger(refreshTrigger+1);
    }
    catch(error){
      console.error(error);
    }

  }

  // create my task list to render
  let tasks = currentTask.map((task) => {
    return (
      <TaskCard
        handleDelete={handleDelete}
        handleComplete={handleComplete}
        is_completed={task.is_completed}
        priority={task.priority}
        key={task.task_id}
        title={task.title}
        desc={task.description}
        dateDue={task.due_at}
        tags={task.tags}
        id={task.task_id}
      ></TaskCard>
    );
  });

  //  delete function
  async function handleDelete(taskId){
    try{
      const response = await fetch('../../api/task',{
        method:'DELETE',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({task_id:taskId}),
      });
      if(!response.ok){
        throw new Error(`response error ${response.status}`);
      }
      const data = await response.json();
      setRefreshTrigger(refreshTrigger+1)
    }
    catch(e){
      console.error(`${e}`)
    }

  }

  return (
    <div className={`cards-container gap-5 flex flex-wrap justify-center `}>
      <Button onClick={handleSubmit}>submit</Button>
      {tasks}
    </div>
  );
}
