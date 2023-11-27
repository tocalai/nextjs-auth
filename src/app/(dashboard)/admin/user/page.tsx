
import { toast } from "@/components/ui/use-toast"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User } from ".prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserStatistic } from "@/types/user"

export const revalidate = 0 // no cache

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const page = async ({ searchParams }: IndexPageProps) => {

  const { page, per_page } = searchParams
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10
  const offset = typeof page === "string" ? parseInt(page) > 0 ? (parseInt(page) - 1) * limit : 0 : 0

  const getUsers = async () => {
    try {
      const usersRes = await fetch(`${process.env.NEXTAUTH_URL}/api/user/admin/read?offset=${offset}&limit=${limit}`, {
        method: 'GET'
      })

      if (!usersRes.ok) throw new Error('Retrieved users failed')

      const { data, totals } = await usersRes.json()
      return { data: data, totals: totals }
    }
    catch (error: any) {
      console.error(error.message)
      toast({
        title: "Get user info failed",
        description: `Something went wrong, ${error.message}.`,
        variant: 'destructive'
      })
    }
  }

  const getStatistics = async (shift: number) => {
    let statistics: UserStatistic = {} as UserStatistic
    try {
      const statisticsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/user/admin/statistics?shift=${shift}`, {
        method: 'GET'
      })

      if (!statisticsRes.ok) throw new Error('Retrieved users statistics failed')
      statistics = await statisticsRes.json()
    }
    catch (error: any) {
      console.error(error.message)
      toast({
        title: "Get user statistic failed",
        description: `Something went wrong, ${error.message}.`,
        variant: 'destructive'
      })
    }
    return statistics
  }

  let users: User[] = []
  let totals: number = 0
  await getUsers().then(val => {
    console.log(val)
    users = JSON.parse(val?.data)
    totals = val?.totals
  })

  const statistics = await getStatistics(7) as UserStatistic

  console.log(statistics)

  const pageCount = Math.ceil(totals / limit)
  return (
    <>
      <Tabs defaultValue="users" className="w-[1000px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          {users.length > 0 && (
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={users} pageCount={pageCount} />
            </div>
          )}
          {users.length === 0 && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Sorry we could not retrieve users data at this moment.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Active User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(statistics).length > 0 && (
                <>
                  <div className="col-span-12">
                    <div className="text-left col-span-6">Totals Sign Up Users<div className="text-right col-span-6">{statistics.totalSignedUpUsers}</div></div>
                  </div><div className="col-span-6">
                    <div className="text-left">Totals Active Users Today<div className="text-right">{statistics.totalActiveSessionToday}</div></div>
                  </div><div className="col-span-6">
                    <div className="text-left">Average Active Users In 7 Days<div className="text-right">{statistics.averageSessionInLast7Days}</div></div>
                  </div>
                </>
              )}
              {Object.keys(statistics).length === 0 && (
                <>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Sorry we could not retrieve users statistics at this moment.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default page