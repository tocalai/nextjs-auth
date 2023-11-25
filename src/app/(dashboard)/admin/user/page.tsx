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

type UserStatistic = {
  totalSignedUpUsers: number
  totalActiveSessionToday: number
  averageSessionInLast7Days: number
}

const page = async () => {
  const session = await getServerSession(authOptions)

  const getUsers = async () => {
    try {
      const usersRes = await fetch(`${process.env.NEXTAUTH_URL}/api/user/admin/read`, {
        method: 'GET'
      })

      if (!usersRes.ok) throw new Error('Retrieved users failed')

      const { data } = await usersRes.json()
      return data
    }
    catch (error: any) {
      console.error(error.message)
      toast({
        title: "Get user statistic failed",
        description: `Something went wrong, ${error.message}.`,
        variant: 'destructive'
      })
    }
  }

  const getlastNdaysActiveUserCount = (data: User[], shift: number) => {
    const today = new Date()
    let lastNDay = new Date()
    if (shift === 0) {
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      lastNDay = new Date(`${year}/${month}/${day}`)
    }
    else {
      lastNDay = new Date(new Date().setDate(today.getDate() - shift))
    }
    const activeUserLastNDays = data.filter((user) => {
      return (
        user.lastLogon && new Date(user.lastLogon) >= lastNDay
        && new Date(user.lastLogon) <= today
      )
    })

    return activeUserLastNDays.length
  }

  const calculateStatistics = (data: User[]) => {
    let statistics: UserStatistic = {} as UserStatistic
    statistics.totalSignedUpUsers = data.length
    statistics.totalActiveSessionToday = getlastNdaysActiveUserCount(data, 0)
    statistics.averageSessionInLast7Days = getlastNdaysActiveUserCount(data, 7) / 7
    return statistics
  }

  const data = JSON.parse(await getUsers())
  if (data.length === 0) {
    return (
      <>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Sorry we could not retrieve users data at this moment.
          </AlertDescription>
        </Alert>
      </>
    )
  }
  console.log(data)
  let statistics = calculateStatistics(data)
  console.log(statistics)
  return (
    <>
      <Tabs defaultValue="users" className="w-[1000px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
          </div>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Active User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="col-span-1">
                <div className="text-left">Totals Sign Up Users<div className="text-right">{statistics.totalSignedUpUsers}</div></div>
              </div>
              <div className="col-span-1">
                <div className="text-left">Totals Active Users Today<div className="text-right">{statistics.totalActiveSessionToday}</div></div>
              </div>
              <div className="col-span-1">
                <div className="text-left">Average Active Users In 7 Days<div className="text-right">{statistics.averageSessionInLast7Days}</div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default page