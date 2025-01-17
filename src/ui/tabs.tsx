import React, { useState } from "react"
import * as L from "../lib"

type Tab = {
    name: string
    key: string
    content: React.JSX.Element
}

export const Tabs = (props: { tabs: L.Arr.NonEmptyArray<Tab> }) => {
    const [tabId, setTab] = useState(props.tabs[0]?.key);
    
    return <div className="tabs">
        <div className="tab-bar" onClick={(event) => console.log(event)}>
            {props.tabs.map(tab => <button key={tab.key} className={tab.key === tabId ? "tab active-tab" : "tab"} onClick={() => setTab(tab.key)}>{tab.name}</button>)}
        </div>
        <div className="tab-content">
            {tabId && props.tabs.find(tab => tab.key === tabId)?.content}
        </div>
    </div>
}
