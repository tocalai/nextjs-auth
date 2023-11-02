import { buttonVariants } from "@/components/ui/button";
import { LampWallUp } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="py-2 border-b fixed w-full top-1">
        <div className="container flex items-center justify-between">
            <Link href="/"><LampWallUp /></Link>
            <Link className={buttonVariants()} href="/sign-in">Sign In</Link>
        </div>
    </div>
  )
}
