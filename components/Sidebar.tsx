import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import routes from "../app/Data/routes_data"
import { usePathname } from 'next/navigation'

const montserrat = Montserrat({
    weight : "600",
    subsets : ["latin"]
  })

const Sidebar = () => {

    const pathname = usePathname();

  return (
    <nav className='border-[#E8E9E911] border min-w-[270px] h-full flex-col text-typography justify-between bg-card_background  rounded-xl px-2 flex'>
        <Link href="/">
          <div className='logo w-full  flex items-center gap-3 px-3 pt-5 pb-5 rounded-md'>
            <Image width={30} height={30} alt="logo" src="/oxion.svg"/>
            <p className={cn('font-sans tracking-wide  text-xl font-medium',montserrat.className)}>Oxion</p>
          </div>
          </Link>
          <div className='border-t border-b border-[#E8E9E911] flex-1 flex flex-col p-3 pt-10 gap-y-1'>
            {routes.map(((route)=>(
              <Link 
              href={route.href}
              key={route.href}
              className={cn("hover:cursor-pointer hover:bg-hoverCard/15 tracking-wide text-typography  p-3 rounded-md",
               pathname === route.href ? "bg-hoverCard/15 text-[#fff]" : ""
              )}
              >
                <div className='flex gap-x-2 justify-start items-center'>
                  <route.icon color={route.color}/>
                  <p>{route.label}</p>
                </div>
              </Link>
            )))}
          </div>
          <div className='p-3 py-5 px-3 flex gap-x-4 justify-start items-center'>
              <UserButton afterSignOutUrl='/'/>
              <div>
                <p className='text-lg tracking-wide leading-6 font-medium'>Mahavir Patel</p>
                <p className=' text-green tracking-wide'>Premium</p>
              </div>
          </div>
      </nav>
  )
}

export default Sidebar