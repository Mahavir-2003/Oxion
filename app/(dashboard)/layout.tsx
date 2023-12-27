"use client"
import React, { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Code, ImageIcon, LayoutDashboard, MessagesSquare, Music, Settings, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const montserrat = Montserrat({
  weight : "600",
  subsets : ["latin"]
})

//

// defining routes data
const routes =[
  {
    label : "Dashboard",
    icon : LayoutDashboard,
    href : "/dashboard",
    color : "text-active_green",
    info : "Welcome to your Dashboard"
  },{
    label : "Conversation",
    icon : MessagesSquare,
    href : "/conversation",
    color : "text-blue",
    info : "Welcome to the most advanced AI Conversation"
  },{
    label : "Image Genration",
    icon : ImageIcon,
    href : "/image",
    color : "text-red",
    info : "Welcome to the most advanced AI Image Genration"
  },{
    label : "Video Genration",
    icon : VideoIcon,
    href : "/video",
    color : "text-orange",
    info : "Welcome to the most advanced AI Video Genration"
  },{
    label : "Music Genration",
    icon : Music,
    href : "/music",
    color : "text-yellow",
    info : "Welcome to the most advanced AI Music Genration"
  },{
    label : "Code Genration",
    icon : Code,
    href : "/code",
    color : "text-purple",
    info : "Welcome to the most advanced AI Code Genration"
  },{
    label : "Settings",
    icon : Settings,
    href : "/settings",
    color : "text-white",
    info : "Welcome to the Settings"
  }
]


const DashboardLayout = ({children}:{
    children : React.ReactNode
}) => {

  const [page , setPage] = useState({
    title : "Dashboard",
    description : "Welcome to Your Dashboard"
  })
  const pathname = usePathname();


  useEffect(()=>{
    const route = routes.find(route => route.href === pathname)
    if(route){
      setPage({
        title : route?.label,
        description : route?.info
      })
    }
  },[pathname])

  return (
    <div className='p-5 h-full relative w-full flex gap-x-3 text-typography  justify-end' >
      <nav className='border-[#E8E9E911] border min-w-[270px] h-full flex flex-col justify-between bg-card_background  rounded-xl px-2'>
        <Link href="/">
          <div className='logo w-full  flex items-center gap-3 px-3 pt-5 pb-5 rounded-md'>
            <Image width={30} height={30} alt="logo" src="/oxion.svg"/>
            <p className={cn('font-sans tracking-wide text-xl font-medium',montserrat.className)}>Oxion</p>
          </div>
          </Link>
          <div className='border-t border-b border-[#E8E9E911] flex-1 flex flex-col p-3 pt-10 gap-y-1'>
            {routes.map(((route)=>(
              <Link 
              href={route.href}
              key={route.href}
              className={cn("hover:cursor-pointer hover:bg-hoverCard tracking-wide text-typography  p-3 rounded-md",
               pathname === route.href ? "bg-hoverCard text-[#fff]" : ""
              )}
              >
                <div className='flex gap-x-2 justify-start items-center'>
                  <route.icon className={cn(route.color)}/>
                  <p>{route.label}</p>
                </div>
              </Link>
            )))}
          </div>
          <div className='p-3 py-5 px-3 flex gap-x-4 justify-start items-center'>
              <UserButton afterSignOutUrl='/'/>
              <div>
                <p className='text-lg tracking-wide leading-6 font-medium'>Mahavir Patel</p>
                <p className=' text-active_green tracking-wide'>Premium</p>
              </div>
          </div>
      </nav>
      <div className='w-full h-full flex flex-col gap-y-3'>
          <div className='w-full bg-card_background rounded-xl py-3 px-5 border-[#E8E9E911] border'>
            <p className='text-lg text-[#fff] tracking-wide font-medium'>{page.title}</p>
            <p className='text-sm text-[#ffffff55] font-light'>{page.description}</p>
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