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
import { useTransition } from "react"

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
      startTransition(() => {
        
      })
    }
    catch (error: any) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Reset Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Password Reset</DialogTitle>
          <DialogDescription>
            Reset your password here, please following these <PasswordCriteriaCard />.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(resetPassword)} className="w-full">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className=' text-right'>
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
                    <div className='text-right'>
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
                    <div className='text-right'>
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
            <DialogFooter>
              <DialogTrigger asChild>
                <Button type="submit" disabled={isPending}>Save Changes</Button>
              </DialogTrigger>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog