import { Button, buttonVariants } from "@/components/ui/button";
import { PlaneTakeoff } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";

export default async function Navbar() {
  const session = await getServerSession()

  return (
    <div className="py-2 border-b fixed w-full top-1">
      <div className="container flex items-center justify-between">
        <Link href="/" ><PlaneTakeoff width={50} height={50}/></Link>
        <div className="">
          {session?.user ? (
            // profile 
            // rest password           
            <UserAccountNav />
          ) : (
            <Link className={buttonVariants()} href="/sign-in">Sign In</Link>)
          }
        </div>
      </div>
    </div>
  )
}
