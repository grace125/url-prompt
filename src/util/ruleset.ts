import { z } from "zod"

export type Action = z.infer<typeof Action>
export type Ruleset = z.infer<typeof Ruleset>

export const Action = z.object({
    path: z.string(),
    recursive: z.boolean(),
})

export const Ruleset = z.object({
    name: z.string(),
    duration: z.number().min(1000),
    reps: z.number().min(1).max(30),
    actions: z.array(Action)
})

export const DEFAULT_ACTION: Action = {
    path: "",
    recursive: true,
}

export const DEFAULT_RULESET: Ruleset = {
    name: "",
    duration: 30000,
    reps: 1,
    actions: []
}

export const update = (rulesets: Ruleset[], callback?: () => void) => {
    chrome.storage.sync.set({ rulesets: JSON.stringify(rulesets) }, callback)
}

export const fetch = (callback: (rulesets: Ruleset[]) => void) => {
    chrome.storage.sync.get({ rulesets: "[]" }, (items) => callback(JSON.parse(items.rulesets)))
}
