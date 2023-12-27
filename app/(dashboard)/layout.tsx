import React from 'react'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

const DashboardLayout = ({children}:{
    children : React.ReactNode
}) => {
  return (
    <div className='p-5 h-full relative w-full flex gap-x-3 text-typography  justify-end' >
      <nav className='border-[#E8E9E911] border min-w-[300px] h-full flex flex-col justify-between bg-card_background  rounded-xl px-2'>
          <div className='logo w-full  flex items-center gap-3 px-3 pt-5 pb-5 rounded-md'>
            <Image width={30} height={30} alt="logo" src="/oxion.svg"/>
            <p className='font-sans tracking-wide text-xl font-medium'>Oxion</p>
          </div>
          <div className='border-t border-b border-[#E8E9E911] flex-1 p-3'>
            All AI Here 
          </div>
          <div className='p-3 py-5 px-3 flex gap-x-4 justify-start items-center'>
              <UserButton afterSignOutUrl='/'/>
              <div>
                <p className=' text-lg tracking-wide leading-6 font-medium'>Mahavir Patel</p>
                <p className=' text-active_green tracking-wide'>Premium</p>
              </div>
          </div>
      </nav>
      <div className='w-full h-full flex flex-col gap-y-3'>
          <div className='w-full bg-card_background rounded-xl py-3 px-5 border-[#E8E9E911] border'>
            <p className='text-lg text-[#fff] tracking-wide font-medium'>Conversation</p>
            <p className='text-sm text-[#ffffff55] font-light'>Welcome to the most Advanced AI Conversation</p>
          </div>
          <div className='w-full flex-1'>
            <main>
              {children}
            </main>
          </div>
      </div>
    </div>
  )
}

export default DashboardLayout