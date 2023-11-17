'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const ProfileSheet = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [id, setId] = useState<string>('')

  const updateUser = async () => {
    try {
      if (!username) {
        throw new Error('Username can not be empty.')
      }
      if (!id) {
        throw new Error('User identity not found.')
      }

      const userRes = await fetch('/api/user/admin/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          username: username
        })
      })

      const { message } = await userRes.json()
      if (!userRes.ok) throw new Error(message)

      toast({
        title: message
      })
    }
    catch (error: any) {
      console.error(error)
      toast({
        title: "Update user failed",
        description: `Something went wrong, {error.message}.`,
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    const getSessionData = async () => {
      const session = await getSession()
      setUsername(session?.user.username || '')
      setEmail(session?.user.email || '')
      setId(session?.user.id || '')
    }
    getSessionData()
  }, [id, username, email]);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          {/* <SheetTitle>Edit profile</SheetTitle> */}
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value={username} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} className="col-span-3" disabled />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={updateUser}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ProfileSheet