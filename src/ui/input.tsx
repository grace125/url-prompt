import React, { useState } from "react";
import { Result, Arr, Let, id } from "../lib"
import { ZodError } from "zod";

export const TextInput = <T,>(p: {
    validate: (s: string) => Result<T, ZodError<string>>,
    onValidInput?: (t: T) => void
    onInvalidInput?: (e: ZodError<string>) => void
    id: string
    value: string | number | readonly string[] | undefined
    label?: string
    labelClassName?: string
    required?: boolean
}) => {
    const [editVal, setEditVal] = useState(p.value)

    return <>
        {p.label !== undefined && <label htmlFor={p.id} className={p.labelClassName}>{p.label}</label>}
        <input id={p.id} value={editVal} required={p.required ?? false} onInput={(event) => {
            setEditVal(event.currentTarget.value)
            p.validate(event.currentTarget.value).match({
                ok:  (r) => p.onValidInput && p.onValidInput(r), 
                err: (e) => p.onInvalidInput && p.onInvalidInput(e),
            })
        }} />
    </>
}

export const Select = <
    T extends number | string | readonly string[] | undefined, 
    Options extends Arr.NonEmptyArray<{ key: string, value: T, className?: string }>
>(p: {
    options: Options,
    onChange?: (t: T) => void 
    id: string
    value: Arr.ArrayType<Options>["key"]
    label?: string
    labelClassName?: string
}) => {
    return <>
        {p.label !== undefined && <label htmlFor={p.id} className={p.labelClassName}>{p.label}</label>}
        <select id={p.id} value={p.value}>
            {p.options.map(opt => <option key={opt.key} value={opt.value} className={opt.className}>{opt.key}</option>)}
        </select>
    </>
}

export const Checkbox = (p: {
    checked: boolean,
    onChange?: (b: boolean) => void,
    id: string
    label?: string
    labelClassName?: string
}) => {
    return <>
        {p.label !== undefined && <label htmlFor={p.id} className={p.labelClassName}>{p.label}</label>}
        <input id={p.id} type="checkbox" checked={p.checked} onChange={
            Let(
                p.onChange, 
                onChange => onChange !== undefined ? ((event) => { onChange(event.currentTarget.checked)}) : id
            )
        }/>
    </>
}