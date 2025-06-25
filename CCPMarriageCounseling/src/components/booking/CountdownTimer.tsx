// components/booking/CountdownTimer.tsx
import React, { useEffect, useState } from "react"
import { Text } from "react-native"

const CountdownTimer = ({ endTime }: { endTime: string }) => {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const deadline = new Date(endTime).getTime() + 24 * 60 * 60 * 1000
    const updateRemaining = () => {
      const now = new Date().getTime()
      const diff = Math.max(deadline - now, 0)
      setRemaining(diff)
    }
    updateRemaining()
    const interval = setInterval(updateRemaining, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  if (remaining <= 0) return null

  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

  return (
    <Text className="text-xs text-green-500 mt-1">
      Còn lại {hours} giờ {minutes} phút {seconds} giây để báo cáo
    </Text>
  )
}

export default CountdownTimer
