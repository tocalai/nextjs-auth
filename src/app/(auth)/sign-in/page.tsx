import SignInForm from '@/app/components/form/SignInForm'
import Loading from '@/app/components/loading'
import { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className='w-full'>
        <SignInForm />
      </div>
    </Suspense>
  )
}

export default page