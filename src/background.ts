import * as U from "./util"
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
    ruleset: U.Ruleset.Ruleset
    timestamp: number
    intervalId: NodeJS.Timer
}>()

chrome.runtime.onMessage.addListener((untypedMessage, sender, sendResponse) => {
    const message: U.Message.Background = untypedMessage
    
    switch (message.case) {
        case "start": {
            runningState.tap(({ intervalId }) => {
                clearInterval(intervalId)
            })
            const intervalId = timer(message.ruleset.timerDuration, message.ruleset.reps, true, () => {
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
            break
        }
        case "stop": {
            runningState.tap(({ intervalId }) => { 
                clearInterval(intervalId) 
            })
            runningState = Option.none()
            break
        }
        default: message satisfies never
    }
})