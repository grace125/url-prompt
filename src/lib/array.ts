import { Option } from "."

type DecrementIndex = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// type MultiplicationIndex = [
//     [0,  0, 0,  0,  0,  0,  0,  0,  0,  0,  0],
//     [0,  1, 2,  3,  4,  5,  6,  7,  8,  9,  10],
//     [0,  2, 4,  6,  8,  10, 10, 10, 10, 10, 10],
//     [0,  3, 6,  9,  10, 10, 10, 10, 10, 10, 10],
//     [0,  4, 8,  10, 10, 10, 10, 10, 10, 10, 10],
//     [0,  5, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//     [0,  6, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//     [0,  7, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//     [0,  8, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//     [0,  9, 10, 10, 10, 10, 10, 10, 10, 10, 10],
//     [0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
// ]
type ArrayNRec<T, N extends ArrayNSize, V extends readonly T[]> =
	N extends -1 ? never : N extends 0 ? V : ArrayNRec<T, DecrementIndex[N], [...V, T]>

export type ArrayType<A extends readonly unknown[]> = A[number]
export type ArrayNSize = DecrementIndex[number]
export type ArrayMinN<T, N extends ArrayNSize> = [...ArrayNRec<T, N, []>, ...T[]]
export type ArrayN<T, N extends ArrayNSize> = ArrayNRec<T, N, []>
export type NonEmptyArray<T> = ArrayMinN<T, 1>

export const lengthGeq = <T, N extends ArrayNSize>(t: T[], n: N): t is ArrayMinN<T, N> => t.length >= n

export const lengthEquals =
	<N extends ArrayNSize>(n: N) =>
	<A>(xs: A[]): xs is ArrayN<A, N> =>
		xs.length === n

export const nonEmpty = <T>(t: T[]): t is NonEmptyArray<T> => t.length >= 1
export const isEmpty = <T>(t: T[]): t is never[] => t.length === 0
export const last = <T>(t: NonEmptyArray<T>) => t.at(-1) as T 
export const find = <T>(ts: T[], pred: (t: T) => boolean): Option<T> => Option.fromNullable(ts.find(pred))
export const toSpliced = <T>(arr: T[], start: number, deleteCount?: number, ...items: T[]) => {
    const newArr = [...arr]
    newArr.splice(start, deleteCount ?? 0, ...items)
    return newArr
}

export const pickRandomNonEmpty = <T>(arr: NonEmptyArray<T>): T => {
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]!
}
export const pickRandom = <T>(arr: T[]): Option<T> => nonEmpty(arr) ? Option.some(pickRandomNonEmpty(arr)) : Option.none()
