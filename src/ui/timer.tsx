import React from "react"
import { useEffect, useState } from "react"
import { M } from "../lib"

export const useMillisElapsed = (start: number, poll: number) => {
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined)
    const [currentTime, setCurrentTime] = useState(Date.now())
    
    useEffect(() => {
        clearInterval(intervalId)
        const newIntervalId = setInterval(() => setCurrentTime(Date.now()), poll)
        setIntervalId(newIntervalId)
    }, [start, poll])

    return currentTime - start
}

const fmtTimerNumber = (n: number): string => n.toLocaleString(undefined, { minimumIntegerDigits: 2 })

export const Timer = (p: {
    repeating: boolean,
    start: number,
    length: number
}) => {
    const elapsed = useMillisElapsed(p.start, 1000)
    const timeLeft = Math.max(M.mod(p.length - M.mod(elapsed, p.length), p.length) , 0)
    const hours = fmtTimerNumber(Math.floor(timeLeft / 3600000))
    const minutes = fmtTimerNumber(Math.floor(timeLeft / 60000) % 60)
    const seconds = fmtTimerNumber(Math.floor(timeLeft / 1000) % 60)

    return <div className="font-mono text-lg flex justify-center">
        <div>{length > 3600000 ? hours + ":" : null }{minutes}:{seconds}</div>
    </div>
}