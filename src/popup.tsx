import "./index.css"
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Result, Parse, Arr, Obj } from "./lib";
import * as U from "./util";
import * as Ui from "./ui";
import "./index.css"
import { DEFAULT_ACTION, DEFAULT_RULESET } from "./util/ruleset";

// const Popup = () => {
//   const [rulesets, setRulesets] = useState<U.Ruleset.Ruleset[]>([]);
//   useEffect(() => { U.Ruleset.fetch((storage) => { setRulesets(storage) }) }, []);

//   // const [count, setCount] = useState(0);
//   // const [currentURL, setCurrentURL] = useState<string>();

//   // useEffect(() => {
//   //   chrome.action.setBadgeText({ text: count.toString() });
//   // }, [count]);

//   // useEffect(() => {
//   //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   //     setCurrentURL(tabs[0]!.url);
//   //   });
//   // }, []);

//   // const changeBackground = () => {
//   //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   //     const tab = tabs[0];
//   //     if (tab.id) {
//   //       chrome.tabs.sendMessage(
//   //         tab.id,
//   //         {
//   //           color: "#555555",
//   //         },
//   //         (msg) => {
//   //           console.log("result message:", msg);
//   //         }
//   //       );
//   //     }
//   //   });
//   // };

//   return (
//     <div>
//       {rulesets.map(ruleset => <>
//           <button onClick={() => U.Message.sendBackground({ case: "start", ruleset })}>{ruleset.name}</button>
//           <hr/>
//         </>
//       )}
//       <br/>
//       <button onClick={() => chrome.runtime.openOptionsPage()}>rules</button>
//     </div>
//   );
// };

const RuleEditor = () => {
  const [status, setStatus] = useState<string>("");
  const [rulesets, setRulesets] = useState<U.Ruleset.Ruleset[]>([]);

  useEffect(() => { U.Ruleset.fetch((storage) => { setRulesets(storage) }) }, []);

  const replaceRuleset = (index: number, ruleset: U.Ruleset.Ruleset ) => setRulesets(Arr.toSpliced(rulesets, index, 1, ruleset))
  const pushRuleset = (ruleset: U.Ruleset.Ruleset) => setRulesets([...rulesets, ruleset])
  const deleteRuleset = (index: number) => setRulesets(Arr.toSpliced(rulesets, index, 1))

  const saveOptions = () => {
    U.Ruleset.update(rulesets, () => {
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
    })
  };

  return (
    <>
      {rulesets.map((ruleset, i) => {
        const setRuleset = (edit: Partial<U.Ruleset.Ruleset> ) => replaceRuleset(i, Obj.copyWith(ruleset, edit))
        const pushAction = (action: U.Ruleset.Action) => setRuleset({ actions: [...ruleset.actions, action] })
        return <div key={i}>
          <div>
            <Ui.TextInput<string> validate={Result.ok} id="name" value={ruleset.name} label="Name:" onValidInput={name => setRuleset({ name })} />
            <button onClick={() => deleteRuleset(i)}>- Delete</button>
            <br/>
            <Ui.TextInput<number> 
              validate={s => Parse.parse(Parse.stringToNumber.refine(n => 1 <= n && n <= 30, "number should be between 1 and 30"), s)}
              id="reps"
              value={ruleset.reps}
              label="Repetitions:"
              onValidInput={reps => setRuleset({ reps })}
            />
            <br/>
            <label htmlFor="duration">Timer Duration:</label>
            <input
              id="duration"
              type="number"
              value={ruleset.timerDuration}
              min="1000"
              onInput={(event) => setRuleset({ timerDuration: event.currentTarget.valueAsNumber })}
            >
            </input>
            <br/>
            <label htmlFor="redirect-method">Url Open Method:</label>
            <select 
              id="redirect-method"
              value={ruleset.redirectMethod}
              onChange={(event) => setRuleset({ redirectMethod: event.currentTarget.value as U.Ruleset.RedirectMethod})}
            >
              {U.Ruleset.redirectMethods.map(method => <option key={method} value={method}>{U.Ruleset.redirectMethodText[method]}</option>)}
            </select>
            <br/>
            Actions:
            <br/>
            {ruleset.actions.map((action, j) => {
              const setAction = (edit: Partial<U.Ruleset.Action>) => setRuleset({ actions: Arr.toSpliced(ruleset.actions, j, 1, Obj.copyWith(action, edit)) })
              const deleteAction = () => setRuleset({ actions: Arr.toSpliced(ruleset.actions, j, 1)})
              return <div key={`${i}-${j}`} className={j % 2 === 0 ? "bg-blue-100" : "bg-blue-200"}>
                <label htmlFor="path">Path:</label>
                <input id="path" type="text" value={action.path} onInput={(event) => setAction({ path: event.currentTarget.value })}/>
                <button onClick={deleteAction}>- Delete</button>
                <br/>
                <label htmlFor="recursive-path">Recursive:</label>
                <input
                  id="recursive-path"
                  type="checkbox"
                  checked={action.recursive}
                  onChange={(event) => setAction({ recursive: event.currentTarget.checked })}
                />
                <br/>
                <label htmlFor="avoid-repetitions">Avoid Repetitions:</label>
                <input
                  id="avoid-repetitions"
                  type="checkbox"
                  checked={action.avoidRepetitions}
                  onChange={(event) => setAction({ avoidRepetitions: event.currentTarget.checked })}
                />
                <br/>
              </div>
            })}
            <br/>
          </div>
          <button onClick={() => pushAction(DEFAULT_ACTION)}>+ Action</button>
          <hr/>
        </div>
      })}
      <button onClick={() => pushRuleset(DEFAULT_RULESET)}>+ Ruleset</button>
      <br/>
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

const RuleUser = () => {
  const [rulesets, setRulesets] = useState<U.Ruleset.Ruleset[]>([]);

  useEffect(() => { U.Ruleset.fetch((storage) => { setRulesets(storage) }) }, []);

  return <div>
    {rulesets.map(ruleset => <>
        <button onClick={() => U.Message.sendBackground({ case: "start", ruleset })}>{ruleset.name}</button>
        <hr/>
      </>
    )}
    <br/>
    <button onClick={() => chrome.runtime.openOptionsPage()}>rules</button>
  </div>
}

const Popup = () => {
  return <div style={{ minWidth: "400px"}}>
    <Ui.Tabs tabs={[
      { name: "Rules", key: "rules", content: <RuleUser />},
      { name: "Edit", key: "edit", content: <RuleEditor />}
    ]} />
  </div>
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
