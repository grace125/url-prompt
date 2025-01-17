import { dbg } from "../lib"

export const redirectMethods = ["tab-group", "window", "separate"] as const
export const redirectMethodText: { [key in RedirectMethod]: string } = {
    "tab-group": "Tab Group",
    window: "New Window",
    separate: "Separate Windows"
}
export type RedirectMethod = typeof redirectMethods[number]

export type Ruleset = { 
    name: string
    timerDuration: number
    reps: number
    redirectMethod: RedirectMethod
    actions: Action[]
}

export type Action = {
    path: string
    recursive: boolean
    avoidRepetitions: boolean
}

export const DEFAULT_ACTION: Action = {
    path: "",
    recursive: true,
    avoidRepetitions: true
}

export const DEFAULT_RULESET: Ruleset = {
    name: "",
    timerDuration: 30000,
    reps: 1,
    redirectMethod: "separate",
    actions: []
}

// TODO: use zod
export const update = (rulesets: Ruleset[], callback?: () => void) => {
    chrome.storage.sync.set({ rulesets: dbg(JSON.stringify(rulesets)) }, callback)
}

export const fetch = (callback: (rulesets: Ruleset[]) => void) => {
    chrome.storage.sync.get({ rulesets: "[]" }, (items) => callback(JSON.parse(items.rulesets)))
}
