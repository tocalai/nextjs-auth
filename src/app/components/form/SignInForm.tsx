'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from "next/link";
import { useForm } from "react-hook-form"
import * as z from "zod"
import GoogleSignInButton from '../ui/GoogleSignInButton'


const FormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is reqired.",
  }).email('Ivalid email.'),
  password: z.string().min(1, 'Password is required.')
})


const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log(values)
}

export default function SignInForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Input your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Input your password" type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className='w-full mt-5' type="submit">Sign In</Button>
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly 
      before:mr-4 before: before: h-px before: flex-grow before: bg-stone-400 after:ml-4 
      after:block after: after: after:bg-stone-400'>
        or
      </div>
      <GoogleSignInButton>Sign In wiht Google</GoogleSignInButton>
      <p className='text-center text-sm text-gray-600 mt-2'>
        If you don&apos;t have an account, please&nbsp;
        <Link className='text-green-500 hover:underline' href="/sign-up">Sign Up</Link>
      </p>
    </Form>
  )
}