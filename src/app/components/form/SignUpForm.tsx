'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from "next/link";
import { useForm } from "react-hook-form"
import * as z from "zod"
import GoogleSignInButton from '../ui/GoogleSignInButton'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import SpinnerButton from '../ui/SpinnerButton '
import { useState } from 'react'
import { validatePassword } from '@/lib/utils'
import { EmailType } from '@/types/enums'
import PasswordCriteriaCard from '../ui/PasswordCriteriaCard'


const FormSchema = z.object({
    username: z.string().min(1, "Username is reqired."),
    email: z.string().min(1, "Email is reqired.").email('Ivalid email.'),
    password: z.string().min(1, 'Password is required.'),
    confirmPassword: z.string().min(1, 'Password confirmation is required.')
})
.refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password not match."
})
.refine((data) => validatePassword(data.password),
{
    path: ["password"],
    message: "Password not meet the criteria."
})



export default function SignUpForm() {
    const router = useRouter()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    })
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsSubmitting(true)
        try {
            const userRes = await fetch('/api/user/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password
                })
            })
            if (!userRes.ok) throw new Error('Invoke /api/user/sign-up failed.')

            const { user } = await userRes.json()
            const mailRes = await fetch('/api/mail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    type: EmailType.EmailValidation
                })
            })

            if (!mailRes.ok) throw new Error('Invoke /api/mail/send failed.')

            router.push('/sign-in')

        }
        catch (error: any) {
            console.error('Sing up failed', error)
            toast({
                title: "Sign up failed",
                description: "Something went wrong, you might contact the admin.",
                variant: 'destructive'
            })
        }

        setIsSubmitting(false)

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className='space-y-3'>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input your Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                <div className=' items-center flex justify-between'>
                                    <FormLabel>Password</FormLabel>
                                    <PasswordCriteriaCard />
                                </div>

                                <FormControl>
                                    <Input placeholder="Input your password" type='password' {...field} />
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
                                <FormLabel>Re-Enter password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Re-Enter your password" type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <SpinnerButton name='Sign Up' state={isSubmitting} disabled={isSubmitting} className='w-full mt-5' type="submit" />
            </form>
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                or
            </div>
            <GoogleSignInButton>Sign In wiht Google</GoogleSignInButton>
            <p className='text-center text-sm text-gray-600 mt-2'>
                If you do have an account, please&nbsp;
                <Link className='text-blue-500 hover:underline' href="/sign-in">Sign In</Link>
            </p>
        </Form>
    )
}