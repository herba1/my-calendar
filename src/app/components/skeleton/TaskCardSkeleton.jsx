import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";

export default function TaskCardSkeleton({ className }) {
  return (
    <Card className={` h-64 w-70 p-6 select-none  animate-pulse ${className}`}>
      <CardTitle className={'p-0 m-0'}>
        <div className=" text-3xl text-transparent rounded-md  bg-gray-200 ">loading</div>
      </CardTitle>
      <CardContent className={'m-0 p-0'}>
        <div className="flex flex-col gap-2 ">
            <div className="  text-transparent rounded-md w-fit  bg-gray-200 ">loading right now</div>
            <div className="  text-transparent rounded-md w-fit  bg-gray-200 ">fffffffffff</div>
            <div className="  text-transparent rounded-md w-fit  bg-gray-200 ">dddddddddd</div>
        </div>
      </CardContent>
        <div className="flex justify-center gap-6">
            <div className="  text-transparent rounded-md w-fit  bg-black ">fffffffffff</div>
            <div className="  text-transparent rounded-md w-fit  bg-red-500 ">fffffffffff</div>
        </div>
    </Card>
  );
}

export function TaskCardsSkeleton(){

    return(
        <div className="flex gap-6">
            <TaskCardSkeleton></TaskCardSkeleton>
            <TaskCardSkeleton></TaskCardSkeleton>
            <TaskCardSkeleton className=" hidden md:flex"></TaskCardSkeleton>
            <TaskCardSkeleton className=" hidden lg:flex"></TaskCardSkeleton>
            
        </div>
        
    )
}
