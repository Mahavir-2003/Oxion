import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const LandingPage
 = () => {
  return (
    <div>
      <Link href="/dashboard">
      <Button variant="secondary">Go to Dashboard</Button>
      </Link>
    </div>
  )
}

export default LandingPage
