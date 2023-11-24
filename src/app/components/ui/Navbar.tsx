import { Button, buttonVariants } from "@/components/ui/button";
import { PlaneTakeoff } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { Separator } from "@radix-ui/react-separator";

export default async function Navbar() {
  const session = await getServerSession()

  return (
    <>
      <div className="py-2 border-b fixed w-full top-1">
        <div className="container flex items-center justify-between">
          <Link href="/" ><PlaneTakeoff width={50} height={50} /></Link>
          <div className="flex h-5 items-center space-x-4">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <Link className={buttonVariants()} href="/sign-in">Sign In</Link>)
            }
          </div>
        </div>
      </div>
    </>
  )
}
