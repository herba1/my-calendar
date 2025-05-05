
import TaskCards from "@/app/components/task/TaskCards";
import TextAreaForm from "@/app/components/ui/textareaform";

export default function Home() {
  return (
    <div className=" h-full w-full flex flex-col ">
      <TextAreaForm></TextAreaForm>
      <TaskCards></TaskCards>
    </div>
  );
}
