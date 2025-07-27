export default function ListHeader({ className,date,time,taskSize }) {
  return (
    <div className={`relative flex flex-col gap-2 px-2 leading-none ${className}`}>
      <p className="text-body-base tracking-snug">{date.dayName??'Someday'}</p>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 tracking-tight">{date.dayNumber?? '99'}</h1>
        <p className="text-h5 tracking-tight">{time?? 'Time?'}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-h4 tracking-tight">{date.monthName?? 'Months'}</p>
        <p className="text-base">{taskSize?`${taskSize} Task`:`No Task`}</p>
      </div>
      <div className="h-2 bg-background-light lg:hidden rounded-sm my-2"></div>
    </div>
  );
}
