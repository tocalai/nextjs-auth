"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";

const Page = () => {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const verifyUserEmail = async () => {
    try {
      const mailRes = await fetch('/api/mail/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
        })
      })

      if (!mailRes.ok) throw new Error('Verfied mail failed.')

      setVerified(true);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }

  }

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);


  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    } else {
      setError('Without Token Information')
    }
  }, [token]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Verifying Email...</CardTitle>

      </CardHeader>
      <CardContent>
        <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "No Token"}</h2>
        <Separator className="my-4" />
        { verified ? (<h2 className="p-2 bg-green-950 text-slate-300">Passed</h2>) : (<h2 className="p-2 bg-red-950 text-slate-300">Failed, error: `${error}`</h2>)}
      </CardContent>
      <CardFooter className="flex justify-center">
        {(!token || !verified) && (
          <Button variant="outline">Resend Email Verification</Button>
        )}
        {verified && (
          <Link className='text-lime-100 hover:underline' href="/sign-in">Sign In</Link>
        )}
      </CardFooter>
    </Card>
  )
}

export default Page
