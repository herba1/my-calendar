import { ChevronLeft, ChevronsLeft, ChevronsRight, ChevronRight } from "lucide-react";

export default function DateChanger({className, changeDay, changeDayToday, date}){
    let buttonClassName = ` bg-white p-1 rounded-md inline-block outline-black/10 outline-2 shadow-md `
    return(
        <div className={` bg-background-light/80 backdrop-blur-md w-fit relative flex items-center gap-2 p-2 rounded-md `}>

            <button className={`${buttonClassName}`} type="button" onClick={()=>{changeDay({month:-1})}}><ChevronsLeft size={24}/></button>
            <button className={`${buttonClassName}`}  type="button" onClick={()=>{changeDay({day:-1})}}><ChevronLeft size={24}/></button>
            <h2 className=" text-h5 tracking-snug">{`${date.monthName?date.monthName.slice(0,3):''} ${date.dayNumber?date.dayNumber:''}, ${date.year?date.year:''}`}</h2>
            <button className={`${buttonClassName}`}  type="button" onClick={()=>{changeDay({day:1})}}><ChevronRight size={24}/></button>
            <button className={`${buttonClassName}`}  type="button" onClick={()=>{changeDay({month:1})}}><ChevronsRight size={24}/></button>

        </div>
    )

}
