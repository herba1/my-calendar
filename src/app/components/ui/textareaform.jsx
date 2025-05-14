"use client";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { useState } from "react";

export default function TextAreaForm({ handleTaskChange, taskState, setTaskStateProp }) {
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(0);

  function handleInput(e) {
    setInput(e.target.value);
    setInputSize(e.target.value.length);
  }

  function handleKeyDown(e){
    if(e.key==='Enter' && e.metaKey || e.ctrlKey)
        e.target.form.requestSubmit();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTaskStateProp('loading')
    try{
      const response = await fetch('../../api/ai',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          message:input
        })
      })
      const data = await response.json();
      console.log(data);
    setTaskStateProp('default');
    setInput('');
    setInputSize(0);
    handleTaskChange();
    }
    catch(e){
      console.error(e);
    setTaskStateProp('default')
    setInput('')
    setInputSize(0);
    }
  }

  return (
    <form action={"#"} onSubmit={handleSubmit} className={` w-full h-full p-6`}>
      <div
        className={`transition-all focus-within:ring-2 border-2 rounded-lg max-h-fit p-2`}
      >
        <Textarea
          placeholder={
            "Tell me about your plans here (appointments, task, important dates). "
          }
          className={` max-h-72 border-none outline-none shadow-none focus-visible:ring-0 resize-none scroll`}
          maxLength="500"
          value={input}
          onChange={handleInput}
          disabled={taskState === "loading"}
          onKeyDown={handleKeyDown}
        ></Textarea>
        <div className="bottom flex justify-between items-center">
          <div>
            <span className="text-xs align-text-bottom text-black/50">
              {inputSize}/500
            </span>
          </div>
          <Button disabled={taskState === "loading"} type="submit">
            {taskState==="loading"?"One sec...":"Go!"} 
          </Button>
        </div>
      </div>
    </form>
  );
}
