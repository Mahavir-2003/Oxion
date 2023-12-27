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
    <div className='p-5 h-full relative w-full flex gap-x-3 text-typography  justify-end' >
      <div className='hidden md:block text-typography'>
      <Sidebar />
      </div>
      <div className='w-full h-full flex flex-col gap-y-3'>
        <div className='w-full bg-card_background rounded-xl py-3 px-5 border-[#E8E9E911] border flex justify-between items-center'>
          <div className=' block md:hidden '>
            <MobileSidebar />
          </div>
          <div>
            <p className='text-lg text-[#fff] tracking-wide font-medium'>{page.title}</p>
            <p className='hidden md:block text-sm text-[#ffffff55] font-light'>{page.description}</p>
          </div>
          <div>
            <UserButton afterSignOutUrl='/' />
          </div>
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