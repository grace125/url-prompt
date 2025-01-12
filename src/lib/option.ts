
export type Option<T> = { some: T } | { none: null }

export const none = { none: null }
export const some = <T>(t: T): Option<T> => ({ some: t })

export const map = <T, U>(f: (t: T) => U) => (opt: Option<T>): Option<U> => "some" in opt ? { some: f(opt.some) } : none
export const bind = <T, U>(f: (t: T) => Option<U>) => (opt: Option<T>): Option<U> => "some" in opt ? f(opt.some) : none