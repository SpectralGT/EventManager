'use client'

import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { useParams } from 'next/navigation'
import { AttendeeOrder } from '@/lib/types'

export interface Item {
  name: string
  price: number
  quantity: number
  served: number
  serveStartTime: string
  serveEndTime: string
}

export default function OrderServePage() {
  const { id } = useParams()
  const [order,setOrder] = useState<AttendeeOrder>()
  const [items, setItems] = useState<Item[]>([])

  // A ref to hold arrays of refs per item
  const checkboxRefs = useRef<Array<Array<HTMLButtonElement | null>>>([])

  useEffect(() => {
      
  }, [id])

  const updateServedCount = (itemIndex: number) => {
    const checkboxes = checkboxRefs.current[itemIndex]
    const checkedCount = checkboxes.filter(cb => cb?.value).length
    setItems(prev =>
      prev.map((item, i) =>
        i === itemIndex ? { ...item, served: checkedCount } : item
      )
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Mark Served Items</h2>
      <div className="space-y-6">
        {items.map((item, itemIndex) => (
          <div key={itemIndex}>
            <p className="mb-2 font-medium">{item.name}</p>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: item.quantity }).map((_, checkboxIndex) => (
                <Checkbox
                  key={checkboxIndex}
                  defaultChecked={checkboxIndex < item.served}
                  ref={(el) => {
                    if (!checkboxRefs.current[itemIndex]) {
                      checkboxRefs.current[itemIndex] = []
                    }
                    checkboxRefs.current[itemIndex][checkboxIndex] = el
                  }}
                  onChange={() => updateServedCount(itemIndex)}
                  className="h-5 w-5"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Served: {item.served} / {item.quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
