
export const copyWith = <A>(a: A, changes: { [K in keyof A]?: A[K] }): A => ({
	...a,
	...changes,
})