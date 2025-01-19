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
    className?: string
}) => {
    const [editVal, setEditVal] = useState(p.value)
    const labelClassName = p.labelClassName ? `app-text-input-label ${p.labelClassName}` : `app-text-input-label`
    const className = p.className ? `app-text-input ${p.className}` : `app-text-input`
    return <>
        {p.label !== undefined && <label htmlFor={p.id} className={labelClassName}>{p.label}</label>}
        <input id={p.id} value={editVal} required={p.required ?? false} className={className} onInput={(event) => {
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
    Options extends Arr.NonEmptyArray<{ key: string, value: T }>
>(p: {
    options: Options,
    onChange?: (t: T) => void 
    id: string
    value: Arr.ArrayType<Options>["key"]
    label?: string
    labelClassName?: string
    className?: string
}) => {
    const labelClassName = p.labelClassName ? `app-select-label ${p.labelClassName}` : `app-select-label`
    const className = p.className ? `app-select ${p.className}` : `app-select`
    return <>
        {p.label !== undefined && <label htmlFor={p.id} className={labelClassName}>{p.label}</label>}
        <select 
            id={p.id} 
            value={p.value}
            className={className}
        >
            {p.options.map(opt => <option key={opt.key} value={opt.value}>{opt.key}</option>)}
        </select>
    </>
}

export const Checkbox = (p: {
    checked: boolean,
    onChange?: (b: boolean) => void,
    id: string
    label?: string
    labelClassName?: string
    containerClassName?: string
    className?: string
}) => {
    const labelClassName = p.labelClassName ? `app-checkbox-label ${p.labelClassName}` : `app-checkbox-label`
    const className = p.labelClassName ? `app-checkbox ${p.labelClassName}` : `app-checkbox`
    return <div className={`flex items-start ${p.containerClassName ?? ""}`}>
        <div className="flex items-center align-middle h-4">
            <input className={className} id={p.id} type="checkbox" checked={p.checked} onChange={
                Let(
                    p.onChange, 
                    onChange => onChange !== undefined ? ((event) => { onChange(event.currentTarget.checked)}) : id
                )
            }/>
        </div>
        {p.label !== undefined && <label htmlFor={p.id} className={labelClassName}>{p.label}</label>}
    </div>
}