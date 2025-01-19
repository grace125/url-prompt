
export class Option<T> {
    constructor(
        private variant: { some: T } | { none: null }
    ) {}

    static none = <T>(): Option<T> => new Option({ none: null })
    static some = <T>(some: T): Option<T> => new Option({ some })
    static fromNullable = <T>(t: T | null | undefined): Option<T> => 
        t !== null && t !== undefined ? Option.some<T>(t) : Option.none()

    map = <U>(f: (t: T) => U): Option<U> => "some" in this.variant ? Option.some(f(this.variant.some)) : Option.none()
    bind = <U>(f: (t: T) => Option<U>): Option<U> => "some" in this.variant ? f(this.variant.some) : Option.none()
    unwrapOr = (backup: T) => "some" in this.variant ? this.variant.some : backup
    unwrapOrElse = (backup: () => T) => "some" in this.variant ? this.variant.some : backup()
    tap = (tapper: (t: T) => void) => "some" in this.variant && tapper(this.variant.some)
    match = <U1, U2>(cases: { some: (t: T) => U1, none: () => U2}): U1 | U2 => "some" in this.variant ? cases.some(this.variant.some) : cases.none()
}