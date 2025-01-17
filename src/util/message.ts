import { Ruleset } from "./ruleset";

export type Background = 
    { case: "start", ruleset: Ruleset } |
    { case: "stop" }

export type Content = never

const typedOnMessageAddListener: <Receive, Send>(callback: (message: Receive, sender: chrome.runtime.MessageSender, sendResponse: (response: Send) => void) => void) => void = chrome.runtime.onMessage.addListener

export const addContentListener = typedOnMessageAddListener<Content, Background>
export const sendContent = chrome.tabs.sendMessage<Content, Background>
export const sendBackground = chrome.runtime.sendMessage<Background, Content>