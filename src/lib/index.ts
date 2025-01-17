export * from "./option"
export * from "./result"
export * as Arr from "./array"
export * as Obj from "./object"
export * as Parse from "./parse"

export const dbg = <T>(t: T) => {
	console.log(t)
	return t
}

export const id = <T>(t: T) => t

export const Let = <T, U>(x: T, then: (x: T) => U) => then(x)