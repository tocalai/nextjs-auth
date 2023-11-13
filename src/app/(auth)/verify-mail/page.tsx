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
import { Label } from "@/components/ui/label";


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
    <Card className="w-[750px]">
      <CardHeader>
        <CardTitle className="text-center">Verifying Email...</CardTitle>

      </CardHeader>
      <CardContent>
        <Label>Token</Label>
        <h2 className="p-2 bg-orange-500 text-black flex-wrap">{token ? `${token}` : "No Token"}</h2>
        <Separator className="my-4" />
        <Label>Result</Label>
        { verified ? (<h2 className="p-2 bg-green-950 text-slate-300">Passed</h2>) : (<h2 className="p-2 bg-red-950 text-slate-300">Failed, error: `${error}`</h2>)}
      </CardContent>
      <CardFooter className="flex justify-center">
        {(!token || !verified) && (
          <Button variant="outline">Resend Email Verification</Button>
        )}
        {verified && (
          <Link className='text-lime-100 bg-slate-950 rounded-md hover:underline' href="/sign-in">Sign In</Link>
        )}
      </CardFooter>
    </Card>
  )
}

export default Page
