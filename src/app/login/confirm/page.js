import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  login,
  signup,
  logout,
  signInWithGoogle,
  loginMagicLink,
} from "../actions";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function confirm() {
    const supabase = await createClient();
    const {data:{user}, error} = await supabase.auth.getUser();

    if(user && user.confirmed_at){
        redirect('/task')
    }
    
  return (
    <div className="relative flex h-svh max-w-full items-center justify-center">
      <Card className={`w-full max-w-sm animate-in`}>
        <CardContent className={`flex flex-col gap-6`}>
          <div className="relative flex w-full flex-col items-center justify-center gap-6">
            <h1 className="text-h3 text-center tracking-tight">
              Almost there...
            </h1>
            <div className="relative flex h-full w-full items-center group justify-center">
              <Mail size={86} className="z-10 origin-center w-1/2 animate-bounce hover:scale-110 transition-all duration-1000 ease-spring-snappy fill-mode-forwards group-hover:rotate-[360deg] "></Mail>
            </div>
            <h1 className="text-body-lg tracking-snug text-center leading-tight">
              Confirm your login clicking on the link we sent you
            </h1>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-sm opacity-70">
              If not found check spam and confirm
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
