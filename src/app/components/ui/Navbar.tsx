import { Button, buttonVariants } from "@/components/ui/button";
import { CandlestickChart, PlaneTakeoff } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { Separator } from "@radix-ui/react-separator";

export default async function Navbar() {
  const session = await getServerSession()

  return (
    <>
      <div className="py-2 border-b relative w-full top-0">
        <div className="container flex items-center justify-between">
          <div className="flex items-start">
            <Link href="/" ><PlaneTakeoff width={35} height={35} /></Link>
            {session?.user && (
              <Link className="ml-3 mt-1" href='/admin/user' as={`/admin/user?page=1&per_page=${process.env.NEXT_PUBLIC_USER_STATISTICS_TABLE_ROWS_PER_PAGE}`} ><CandlestickChart width={35} height={35} /></Link>
            )}
          </div>
          <div className="flex h-5 items-center space-x-4">
            {session?.user ? (
              <UserAccountNav />
            ) : (
              <>
                <Link className={buttonVariants()} href="/sign-in">Sign In</Link>
              </>
            )
            }
          </div>
        </div>
      </div>
    </>
  )
}
