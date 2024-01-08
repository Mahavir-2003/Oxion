"use client"
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import routes from "../Data/routes_data"
import Sidebar from '@/components/Sidebar'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from '@/components/MobileSidebar'


const DashboardLayout = ({ children }: {
  children: React.ReactNode
}) => {

  const [page, setPage] = useState({
    title: "Dashboard",
    description: "Welcome to Your Dashboard"
  })
  const pathname = usePathname();


  useEffect(() => {
    const route = routes.find(route => route.href === pathname)
    if (route) {
      setPage({
        title: route?.label,
        description: route?.info
      })
    }
  }, [pathname])

  return (
    <div className='p-5   h-[100dvh] relative w-full flex gap-x-3 text-typography  justify-end' >
      <div className='hidden lg:block text-typography'>
      <Sidebar />
      </div>
      <div className='w-full  flex flex-col gap-y-3 h-full '>
        <div className='w-full bg-card_background rounded-xl py-3 px-5 border-[#E8E9E911] border flex justify-between lg:justify-center items-center'>
          <div className=' block lg:hidden '>
            <MobileSidebar />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <p className='text-xl text-[#fff] tracking-wide mb-1'>{page.title}</p>
            <p className='hidden lg:block text-sm text-[#ffffff88] font-extralight'>{page.description}</p>
          </div>
          <div className='block lg:hidden'>
            <UserButton afterSignOutUrl='/' />
          </div>
        </div>
        <div className='w-full h-full flex-1'>
          <main  className='w-full h-full flex '>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout