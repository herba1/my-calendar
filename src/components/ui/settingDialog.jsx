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

export default function SettingDialog({ children, className, user }) {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <div className="flex w-full items-center justify-between">
            <DialogTitle>Account Settings</DialogTitle>
          </div>
          <DialogDescription>
            Change your name, or delete your account;
          </DialogDescription>
        </DialogHeader>
        <form className="w-full">
            <h1>Under Construction👷Check back soon! or Contact me</h1>
            {/* <Button className={'w-full'} variant={'destructive'}>Delete Account</Button> */}
        </form>
      </DialogContent>
      {children}
    </Dialog>
  );
}
