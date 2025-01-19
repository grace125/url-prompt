import "./index.css"
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Result, Parse, Arr, Obj, dbg } from "./lib";
import { Message, Ruleset } from "./util";
import * as Ui from "./ui";
import "./index.css"
import { DEFAULT_ACTION, DEFAULT_RULESET } from "./util/ruleset";

const RuleUser = () => {
  const [rulesets, setRulesets] = useState<Ruleset.Ruleset[]>([]);
  const bg = Message.useBackground()

  useEffect(() => { 
    Ruleset.fetch((storage) => { setRulesets(storage) }) 
    chrome.storage.onChanged.addListener(() => {
      Ruleset.fetch((storage) => { setRulesets(storage) }) 
    })
    
  }, []);

  return <div>
    { bg.state.case === "running" ? <div className="flex flex-col flex-center">
      <Ui.Card className="float-right bg-blue-400">
        <Ui.Timer repeating={true} start={bg.state.timestamp} length={bg.state.ruleset.duration} />
      </Ui.Card>
      <button className="float-right rounded-md bg-red-400 hocus:bg-black-400 py-1 px-2" onClick={() => bg.send({ case: "stop" })}>stop</button>
    </div> : <>
      {rulesets.map(ruleset => <>
          <button key={ruleset.name} onClick={() => bg.send({ case: "start", ruleset })}>{ruleset.name}</button>
          <hr/>
        </>
      )}
    </> }
  </div>
}

const RuleEditor = () => {
  const [status, setStatus] = useState<string>("");
  const [rulesets, setRulesets] = useState<Ruleset.Ruleset[]>([]);

  useEffect(() => { Ruleset.fetch((storage) => { setRulesets(storage) }) }, []);

  const replaceRuleset = (index: number, ruleset: Ruleset.Ruleset ) => setRulesets(Arr.toSpliced(rulesets, index, 1, ruleset))
  const pushRuleset = (ruleset: Ruleset.Ruleset) => setRulesets([...rulesets, ruleset])
  const deleteRuleset = (index: number) => setRulesets(Arr.toSpliced(rulesets, index, 1))

  const saveOptions = () => {
    Ruleset.update(rulesets, () => {
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
    })
  };

  return (
    <div className="space-y-3 m-2">
      {rulesets.map((ruleset, i) => {
        const setRuleset = (edit: Partial<Ruleset.Ruleset> ) => replaceRuleset(i, Obj.copyWith(ruleset, edit))
        const pushAction = (action: Ruleset.Action) => setRuleset({ actions: [...ruleset.actions, action] })
        return <Ui.Card className="p-3 bg-slate-200" key={i}>
          <div>
            <button className="float-right" onClick={() => deleteRuleset(i)}>- Delete</button>
            <Ui.TextInput<string> 
              className="mb-3"
              validate={Result.ok} id="name" value={ruleset.name} label="Name:" onValidInput={name => setRuleset({ name })} 
            />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div><Ui.TextInput<number> 
                className="max-w-40"
                validate={s => Parse.parse(Parse.stringToNumber.refine(n => 1 <= n && n <= 30, "number should be between 1 and 30"), s)}
                id="reps" value={ruleset.reps} 
                label="Repetitions:"
                onValidInput={reps => setRuleset({ reps })}
              /></div>
              <div><Ui.TextInput<number> 
                className="max-w-40"
                validate={s => Parse.parse(Parse.stringToNumber.refine(n => 1000 <= n, "duration should be at least 1 second long"), s)}
                id="duration"
                value={ruleset.duration}
                label="Timer Duration:"
                onValidInput={duration => setRuleset({ duration: dbg(duration) })}
              /></div>
            </div>
            <h1>Actions</h1>
            {ruleset.actions.map((action, j) => {
              const setAction = (edit: Partial<Ruleset.Action>) => setRuleset({ actions: Arr.toSpliced(ruleset.actions, j, 1, Obj.copyWith(action, edit)) })
              const deleteAction = () => setRuleset({ actions: Arr.toSpliced(ruleset.actions, j, 1)})
              return <Ui.Card key={`${i}-${j}`} className={(j % 2 === 0 ? "bg-blue-100" : "bg-blue-200") + " p-3"}>
                <button onClick={deleteAction} className="float-right">- Delete</button>
                <Ui.TextInput<string> className="mb-3" validate={Result.ok} id="path" label="Path:" value={action.path} onValidInput={path => setAction({ path })}/>
                <Ui.Checkbox id="recursive-path" label="Recursive" checked={action.recursive} onChange={recursive => setAction({ recursive })}/>
              </Ui.Card>
            })}
            <br/>
          </div>
          <button className="float-right" onClick={() => pushAction(DEFAULT_ACTION)}>+ Action</button>
          <br/>
        </Ui.Card>
      })}
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
      <button className="float-right" onClick={() => pushRuleset(DEFAULT_RULESET)}>+ Ruleset</button>

    </div>
  );
};

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
