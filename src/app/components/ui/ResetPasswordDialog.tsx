'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import PasswordCriteriaCard from "./PasswordCriteriaCard"
import * as z from "zod"
import { validatePassword } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState, useTransition } from "react"
import { getSession } from "next-auth/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Terminal, XCircle } from "lucide-react"

const FormSchema = z.object({
  oldPassword: z.string().min(1, 'Filed is reqired.'),
  newPassword: z.string().min(1, 'Filed is required.'),
  confirmPassword: z.string().min(1, 'Filed is required.')
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password not match."
  })
  .refine((data) => validatePassword(data.newPassword),
    {
      path: ["newPassword"],
      message: "Password not meet the criteria."
    })

const ResetPasswordDialog = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>('')
  const [isFault, setFault] = useState<boolean>(false)
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  })

  const resetPassword = async (values: z.infer<typeof FormSchema>) => {
    try {
      startTransition(async () => {
        const session = await getSession()

        const userRes = await fetch('/api/user/admin/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: session?.user.id,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
          })
        })

        if (!userRes.ok) {
          const { message } = await userRes.json()
          setMessage(`Reset password failed, ${message}`)
          setFault(true)
        }
        else {
          setMessage('Reset password successfully.')
          setFault(false)
          form.reset()
        }

      })
    }
    catch (error: any) {
      console.error(error)
      setMessage(`Reset password failed, ${error.message}`)
      setFault(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Reset Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => {
        e.preventDefault();
      }}>
        <DialogHeader>
          {/* <DialogTitle>Password Reset</DialogTitle> */}
          <DialogDescription>
            Reset your password here, please following these <PasswordCriteriaCard className="text-right" />.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(resetPassword)} className="">
            <div className="flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className=''>
                      <FormLabel>Old Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input type='password' {...field} className='col-span-3' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className=''>
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input type='password' {...field} className='col-span-3' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className=''>
                      <FormLabel>Confirm Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input type='password' {...field} className='col-span-3' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}

              />
            </div>
            <DialogFooter className="pt-6">
              {/* <DialogTrigger asChild> */}
              <Button type="submit" disabled={isPending}>Save Changes</Button>
              {/* </DialogTrigger> */}
            </DialogFooter>
          </form>
        </Form>
        {message && !isFault &&(
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>{message} You could close the dailog</AlertTitle>
          </Alert>)}
        {message && isFault && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>)}
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog