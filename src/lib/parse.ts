import { z, ZodError, ZodType, ZodTypeDef } from "zod"
import { Result } from "."

export const parse = <Output, Def extends ZodTypeDef, Input>(
  schema: ZodType<Output, Def, Input>, 
  input: Input
): Result<Output, ZodError<Input>> => {
    const p = schema.safeParse(input)
    if (p.success) {
        return Result.ok(p.data)
    }
    else {
        return Result.err(p.error)
    }
}

export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type JsonLiteral = z.infer<typeof literalSchema>;
export type Json = JsonLiteral | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const stringToNumber = z.string().transform((s, ctx) => {
  const parsed = parseInt(s);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Not a number'
    })
    return z.NEVER
  }
  else {
    return parsed
  }
})

