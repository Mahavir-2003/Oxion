"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from '@/components/Sidebar'
import { usePathname } from 'next/navigation'


const MobileSidebar = () => {

  const [isMounted , setIsMounted] = useState(false);
  const [isOpen , setIsOpen] = useState(false);
  var pathname = usePathname()

  useEffect(()=>{
    setIsMounted(true)
  },[])

  useEffect(()=>{
    if(isOpen){
      setIsOpen(false)
    }
  },[pathname])

  if(!isMounted){
    return null;
  }

  return (
    <Sheet open={isOpen}  onOpenChange={(e)=>setIsOpen(e)}>
    <SheetTrigger autoFocus={true} >
    <Button variant="ghost" size="icon"  onClick={()=>setIsOpen(true)}>
      <Menu />
    </Button>
    </SheetTrigger>
    <SheetContent side="left" className='bg-transparant border-none p-5'>
      <Sidebar />
    </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar