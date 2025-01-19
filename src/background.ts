import { Message, Ruleset } from "./util"
import { Option, Arr } from "./lib"
import * as Chrome from "./chrome"

const timer = (duration: number, repetitions: number, immediate: boolean, callback: () => void) => {
    if (immediate && repetitions > 0) callback()
    let repetitionsLeft = immediate ? repetitions - 1 : repetitions 
    let intervalId: NodeJS.Timer | undefined = undefined
    intervalId = setInterval(() => {
        if (repetitionsLeft <= 0) {
            clearInterval(intervalId)
            return
        }
        callback()
        repetitionsLeft -= 1
    }, duration)
    return intervalId
}

let bookmarkTree: chrome.bookmarks.BookmarkTreeNode[] = []

chrome.bookmarks.getTree().then(tree => bookmarkTree = tree)

chrome.bookmarks.onChanged.addListener(() => {
    chrome.bookmarks.getTree().then(tree => bookmarkTree = tree)
})

let runningState = Option.none<{ 
    ruleset: Ruleset.Ruleset
    timestamp: number
    intervalId: NodeJS.Timer
}>()

chrome.runtime.onMessage.addListener((message: Message.Background, sender, sendResponse: (c: Message.BackgroundState) => void) => {
    switch (message.case) {
        case "start": {
            console.log("start!", runningState)
            runningState.tap(({ intervalId }) => {
                clearInterval(intervalId)
            })
            const intervalId = timer(message.ruleset.duration, message.ruleset.reps, true, () => {
                for (const action of message.ruleset.actions) {

                    Chrome.Bookmarks.search(bookmarkTree, action.path).match({
                        ok: (node) => {
                            const urlPool = Chrome.Bookmarks.extractUrls(node, { recursive: action.recursive })
                            Arr.pickRandom(urlPool).tap(url => chrome.tabs.create({
                                active: true,
                                url
                            }))
                        },
                        err: (err) => {
                            console.error(err)
                        }
                    })
                }
            })
            
            runningState = Option.some({
                ruleset: message.ruleset,
                timestamp: Date.now(),
                intervalId: intervalId 
            })
            sendResponse({
                case: "running",
                ruleset: message.ruleset,
                timestamp: Date.now()
            })
            break
        }
        case "stop": {
            console.log("stop!", runningState)
            runningState.tap(({ intervalId }) => { 
                clearInterval(intervalId) 
            })
            runningState = Option.none()
            sendResponse({ case: "stopped" })
            break
        }
        case "query": {
            console.log("query (bg)!", runningState)
            sendResponse(runningState.match({
                some: state => ({ case: "running", ruleset: state.ruleset, timestamp: state.timestamp }),
                none: () => ({ case: "stopped" })
            }))
            break
        }
        default: message satisfies never
    }
})