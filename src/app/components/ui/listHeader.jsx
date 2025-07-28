"use client";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { Split } from "lucide-react";
gsap.registerPlugin(SplitText);
export default function ListHeader({ className, date, time, taskSize }) {
  const container = useRef(null);
  const [isFirst, setIsFirst] = useState(true);

  useGSAP( () => {
      if (date?.dayName && isFirst && taskSize >= 0) {
        let items = container.current.querySelectorAll(".split");
        let split = SplitText.create(items, {
          type: "lines, chars",
          mask: "lines",
        });
        gsap.set(items, { opacity: 1 });
        gsap.fromTo(
          split.chars,
          {
            yPercent: 100,
          },
          {
            yPercent: 0,
            ease: "power4.out",
            duration: 1,
            stagger: 0.03,
            onComplete: () => split.revert(),
          },
        );
        setIsFirst(false);
      }
    },
    { scope: container.current, dependencies: [date, taskSize] },
  );

  return (
    <div
      ref={container}
      className={`relative flex flex-col gap-2 px-2 leading-none ${className}`}
    >
      <p className="split text-body-base tracking-snug opacity-0">
        {date.dayName ?? "Someday"}
      </p>
      <div className="flex items-center justify-between">
        <h1 className="split text-h2 tracking-tight opacity-0">
          {date.dayNumber ?? "99"}
        </h1>
        <p className="text-h5 split tracking-tight opacity-0">
          {time ?? "Time?"}
        </p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-h4 split tracking-tight opacity-0">
          {date.monthName ?? "Months"}
        </p>
        <p className="split text-base opacity-0">
          {taskSize ? `${taskSize} Task` : `No Task`}
        </p>
      </div>
      <div className="bg-background-light my-2 h-2 rounded-sm lg:hidden"></div>
    </div>
  );
}
