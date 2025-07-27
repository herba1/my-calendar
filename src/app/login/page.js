import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  login,
  signup,
  logout,
  signInWithGoogle,
  loginMagicLink,
} from "./actions";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex h-svh max-w-full items-center justify-center">
      <Card className={`w-full max-w-sm`}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your Email below or sign in using Google
          </CardDescription>
        </CardHeader>

        <CardContent className={`flex flex-col gap-6`}>
          <form>
            <Button
              variant={"outline"}
              className="w-full flex justify-center items-center"
              formAction={signInWithGoogle}
            >
              <Image
                width={70}
                height={70}
                src={`/g.png`}
                alt="Google Icon"
                className="w-4.5 select-none"
              ></Image>
              <span>Login with Google </span>
            </Button>
          </form>
          <div className="flex w-full max-w-full items-center justify-center gap-2">
            <Separator className={`max-w-3/8`}></Separator>
            <p>Or</p>
            <Separator className={`max-w-3/8`}></Separator>
          </div>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="ex@email.com"
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              <Button
                variant={``}
                className={`w-full`}
                formAction={loginMagicLink}
              >
               Continue with Email 
              </Button>
            </div>
            {/* <Button formAction={signup}>Sign up</Button> */}
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col items-center gap-2">
            <Link
              href={`/task`}
              className="text-sm opacity-70 hover:underline"
            >
              Try it now
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
