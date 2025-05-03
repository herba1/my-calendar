'use client'
import { useState } from "react";
import { Card,CardAction,CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card"
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";


const TASK = [
    {
        title:"Some Task 1",
        desc:"desc goes here",
        dateDue:"Apr 22 2025",
    },
    {
        title:"Some Task 2",
        desc:"desc goes here",
        dateDue:"Apr 24 2027",
    },
    {
        title:"Some Task 3",
        desc:"desc goes here",
        dateDue:"Apr 25 2025",
    },
    {
        title:"Some Task 4",
        desc:"desc goes here",
        dateDue:"Apr 25 2025",
    },
]

function TaskCard({ title="Some Task", desc="No description", dateDue="No Date", handleDelete, handleComplete}){

    return(
        <Card className={`w-70 p-7 flex flex-col`}>
          <CardTitle className={`text-xl`}>{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
          <CardFooter className={` flex gap-2 p-0 self-end text-nowrap`}>
            <div>{dateDue}</div> 
            <Separator orientation="vertical" className={`bg-black/30`}></Separator>
             <div></div>
          </CardFooter>
          <CardFooter className={` flex justify-between w-full  p-0 self-end text-nowrap`}>
            <Button variant={"destructive"} onClick={()=>handleDelete(title)}>Remove</Button>
            <Button variant={"default"} onClick={()=>handleComplete(title)}>Complete</Button>
          </CardFooter>
          
        </Card>
    )
}

export default function TaskCards(){
    const [ currentTask, setCurrentTask ] = useState(TASK);

    function handleDelete(oldTaskTitle){
        let newTaskList = currentTask.filter((task)=>{
            if(task.title != oldTaskTitle) return true;
            else return false;
        })
        setCurrentTask(newTaskList);
    }

    function handleComplete(oldTaskTitle){
        let newTaskList = currentTask.map((task)=>{
            if(task.title === oldTaskTitle){
                return {...task, title:`completed ${task.title}`}
            }
            return task;
        })
        setCurrentTask(newTaskList);
    }

    let tasks = currentTask.map((task)=>{
        return(
            <TaskCard handleDelete={handleDelete} handleComplete={handleComplete} key={task.title} title={task.title} desc={task.desc} dateDue={task.dateDue} ></TaskCard>
        )
    })

    return (
      <div className={`cards-container gap-5 flex flex-wrap justify-center `}>
        {tasks}
      </div>
    );

}