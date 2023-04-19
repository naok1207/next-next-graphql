'use client'
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Client() {
  useEffect(() => {
    (async () => {
      const session = await getSession()
      console.log({ session })
      try {
        const res = await fetch('http://localhost:3000')
        console.log(res)
        console.log(res.headers.entries())
      }catch (err) {
        console.log(err)
      }
    })()
  }, []);

  return (
    <div>
      <p>Client</p>
    </div>
  )
}
