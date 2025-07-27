import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { loginMagicLink, setUsernameInitial } from "../login/actions";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function onbaord() {

  const supabase = await createClient();
  const {data:{user}, error} = await supabase.auth.getUser();
  if(!user){
    redirect('/login')
  }
  if(user.user_metadata.name && user.user_metadata.name.length>0){
    redirect('/task')
  }


  return (
    <div className="relative flex h-svh max-w-full items-center justify-center">
      <nav className="absolute top-0 left-1/2 mt-4 -translate-x-1/2">
        <Link href={"/task"} className="relative h-full w-full">
          <Image
            width={128}
            height={1}
            src={`/essence_logo.svg`}
            alt="img"
          ></Image>
          <Image
            className="absolute top-0 left-0 opacity-40 blur-xs transition-all duration-500 hover:opacity-50 hover:blur-sm"
            src={`/essence_logo.svg`}
            alt="img"
            width={128}
            height={1}
          ></Image>
        </Link>
      </nav>
      <Card className={`w-full max-w-sm`}>
        <CardHeader>
          <CardTitle>Just need a couple of things...</CardTitle>
          <CardDescription>Enter the required fields below</CardDescription>
        </CardHeader>
        <CardContent className={`flex flex-col gap-6`}>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  placeholder="John"
                  id="firstName"
                  name="firstName"
                  type="firstName"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  placeholder="Doe"
                  id="lastName"
                  name="lastName"
                  type="lastName"
                  required
                />
              </div>
              <Button variant={``} className={`w-full`} formAction={setUsernameInitial}>
                Continue
              </Button>
            </div>
            {/* <Button formAction={signup}>Sign up</Button> */}
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
