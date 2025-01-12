import * as Option from "./lib/option"

export type RedirectMethod = "tab-group" | "window" | "separate"

export type Exercise = { 
    name: string
    length: Option.Option<number>
    redirectMethod: RedirectMethod
    actions: UrlChoice[]
}

export type UrlChoice = {
    directory: string
    recursive: boolean
    withReplacement: boolean
}
