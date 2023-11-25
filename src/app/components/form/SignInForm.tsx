'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from "next/link";
import { useForm } from "react-hook-form"
import * as z from "zod"
import GoogleSignInButton from '../ui/GoogleSignInButton'
import { getSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import SpinnerButton from '../ui/SpinnerButton '
import { ToastAction } from '@/components/ui/toast';
import { EmailType } from '@/types/enums';



const FormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is reqired.",
  }).email('Ivalid email.'),
  password: z.string().min(1, 'Password is required.')
})


export default function SignInForm() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [verified, setVerified] = useState(true);
  const [id, setId] = useState('');

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true)
    try {
      const signInData = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      if (!signInData?.ok) throw new Error('Sign in failed.')

      const session = await getSession()
      if (session?.user.isVerified) {
        router.refresh()
        router.push('/admin/user')
      }
      else {
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in?user=${JSON.stringify(session?.user)}`
        })
      }

    } catch (error: any) {
      console.error(error)
      toast({
        title: "Sign in failed",
        description: "Something went wrong, you might contact the admin.",
        variant: 'destructive'
      })
    }
    setIsSubmitting(false)
  }

  const sendMail = async () => {
    try {

      const mailRes = await fetch('/api/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: id,
          type: EmailType.EmailValidation
        })
      })

      if (!mailRes.ok) throw new Error('Invoke /api/mail/send failed.')

      toast({
        title: "Resend verification mail successfully",
      })

    } catch (error: any) {
      console.error('Send mail failed', error)
      toast({
        title: "Resend mail failed",
        description: "Something went wrong, you might contact the admin.",
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    var userUrl = window.location.search.split("=")[1];
    if (userUrl && userUrl.indexOf('error') > 0) {
      return
    }

    if (!userUrl) {
      setVerified(true);
    }
    else {
      const user = JSON.parse(decodeURI(userUrl))
      setVerified(user.isVerified)
      setId(user.id)
    }
  }, []);

  useEffect(() => {
    if (!verified) {
      toast({
        title: 'Sign up not completed',
        description: 'Please verify your account email.',
        action: <ToastAction altText="Resend Email Verification" onClick={sendMail}>Resend Email</ToastAction>
      })
    }
  }, [verified]);

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

        <SpinnerButton name='Sign In' state={isSubmitting} disabled={isSubmitting} className='w-full mt-5' type="submit" />
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        OR CONTINUE WITH
      </div>
      <GoogleSignInButton>Sign In wiht Google</GoogleSignInButton>
      <p className='text-center text-sm text-gray-600 mt-2'>
        If you don&apos;t have an account, please&nbsp;
        <Link className='text-green-500 hover:underline' href="/sign-up">Sign Up</Link>
      </p>
    </Form>

  )
}