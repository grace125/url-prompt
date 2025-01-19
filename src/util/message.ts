import { useEffect, useState } from "react";
import { Ruleset } from "./ruleset";

export type Background = 
    | { case: "start", ruleset: Ruleset }
    | { case: "stop" }
    | { case: "query" }

export type BackgroundState = 
    | { case: "running", ruleset: Ruleset, timestamp: number }
    | { case: "stopped" }

export const useBackground = () => {
  const [background, setBackground] = useState<BackgroundState>({ case: "stopped" })

  useEffect(() => {
    chrome.runtime.sendMessage<Background, BackgroundState>({ case: "query" }, (msg) => {
      console.log("set background")
      setBackground(msg)
    })
  }, [])

  const send = (message: Background) => {
    chrome.runtime.sendMessage<Background, BackgroundState>(
      message, 
      (response) => setBackground(response)
    )
  }

  return { state: background, send }
}