
import TaskCards from "@/components/task/TaskCards";
import TextAreaForm from "@/components/ui/textareaform";

export default function Home() {
  return (
    <div className=" h-full w-full flex flex-col ">
      <TextAreaForm></TextAreaForm>
      <TaskCards></TaskCards>
    </div>
  );
}
