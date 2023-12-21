import React, { ReactNode } from 'react'


const AuthLayout = ({ children }: {
  children: ReactNode
}) => {
  return (
    <div className='bg-slate-200 p-10 rounded-md w-[750px] mx-auto mt-4'>{children}</div>
  )
}

export default AuthLayout