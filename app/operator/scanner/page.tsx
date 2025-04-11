'use client'

import { Scanner } from '@yudiel/react-qr-scanner';
import { redirect } from 'next/navigation'


export default function OrderServePage() {
  
  const handleScan = (id:string) => {
    redirect(`/operator/order/${id}`);
  }

  return (
    <div className="p-6">
     <Scanner onScan={(result) => handleScan(result[0].rawValue)} />


    </div>
  )
}
