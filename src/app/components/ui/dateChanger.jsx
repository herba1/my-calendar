import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "./button";

export default function DateChanger({
  className,
  changeDay,
  changeDayToday,
  date,
  isToday,
}) {
  let buttonClassName = ` touch-manipulation bg-white p-1 rounded-md inline-block outline-black/10 outline-2 shadow-md `;
  return (
    <div
      className={`relative flex items-center justify-between gap-2 ${className} `}
    >
      {!isToday ? (
        <Button
          onClick={() => {
            changeDayToday();
          }}
          className={` touch-manipulation absolute bottom-full left-1/2 z-10 -translate-x-1/2 shadow-md backdrop-blur-md`}
        >
          Return to Today
        </Button>
      ) : (
        ""
      )}
      <div className="flex gap-2 ">
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
      <h2 className="text-h5 tracking-snug max-w-fit text-center">{`${date.monthName ? date.monthName.slice(0, 3) : ""} ${date.dayNumber ? date.dayNumber : ""}, ${date.year ? date.year : ""}`}</h2>
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
