export default function ListHeader({ className }) {
  return (
    <div className={`relative container flex flex-col gap-2 px-2 leading-none ${className}`}>
      <p className="text-body-base tracking-snug">Thursday</p>
      <div className="flex items-center justify-between">
        <h1 className="text-h2 tracking-tight">25</h1>
        <p className="text-h5 tracking-tight">3:03pm</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-h4 tracking-tight">January</p>
        <p className="text-base">1 Task</p>
      </div>
    </div>
  );
}
