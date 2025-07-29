import { Cross } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { changeName } from "@/app/login/actions";
import { useActionState, useState } from "react";

export default function SettingDialog({ children, className, user }) {
  const [name, setName] = useState(user?.user_metadata.name);
  const [state, changeNameAction, isPending] = useActionState(changeName, null);
  return (
    <Dialog>
      {user?.user_metadata && !user.is_anonymous && (
        <DialogContent className={`gap-6`}>
          <DialogHeader className={`items-start justify-start`}>
            <div className="">
              <DialogTitle>Account Settings</DialogTitle>
            </div>
            <DialogDescription>Change your account name</DialogDescription>
          </DialogHeader>
          <div className="flex w-full flex-col gap-5">
            <form className="grid w-full gap-1">
              <Label htmlFor="email">Email</Label>
              <Input readOnly id={`email`} value={user.email}></Input>
            </form>
            <form className="grid w-full gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id={`name`}
                name={`name`}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              ></Input>
              <Button type={`submit`} formAction={changeNameAction}>
                {isPending ? "Changing Name..." : "Change Name"}
              </Button>
              <span className="text-body-base">
                {state?.error && <p className="text-red-500">{state.error}</p>}
                {/* {state?.success && (
                <p className="text-green-600">{state.success}</p>
              )} */}
              </span>
            </form>
          </div>
        </DialogContent>
      )}
      {children}
    </Dialog>
  );
}
