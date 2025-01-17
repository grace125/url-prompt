
export class Result<R, E> {
    constructor(
        private variant: { ok: R } | { err: E }
    ) {}

    static ok = <R, E>(ok: R): Result<R, E> => new Result({ ok })
    static err = <R, E>(err: E): Result<R, E> => new Result({ err })
    
    match = <T>(cases: { ok: (r: R) => T, err: (e: E) => T }): T => 
        "ok" in this.variant ? cases.ok(this.variant.ok) : cases.err(this.variant.err)
}

