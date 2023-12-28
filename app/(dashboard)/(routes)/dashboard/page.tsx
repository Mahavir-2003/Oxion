import React from 'react'
import routes from '@/app/Data/routes_data'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const DashboardPage = () => {
  return (
    <div className='flex flex-col justify-start items-center h-full w-full gap-y-2'>
      {routes.filter((r)=>r.isDashboardVisible).map(((route)=>(
        <Link href={route.href} key={route.href} className=' w-full flex justify-between items-center bg-card_background p-3 rounded-md border border-typography/10 hover:bg-hoverCard/0 hover:px-5 transition-all ease-in-out duration-100'>
          <div className='w-full flex gap-x-3 items-center'>
            <div className={cn(route.bgColor, "p-3 rounded-sm")}><route.icon color={route.color} /></div>
            <p className=' text-md'>{route.label}</p>
          </div>
          <div>
            <ArrowRight />
          </div>
        </Link>
      )))}
    </div>
  )
}

export default DashboardPage