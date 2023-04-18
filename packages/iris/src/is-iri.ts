import {validateIri, IriValidationStrategy} from 'validate-iri';
import {z} from 'zod';

export function isIri(value: string) {
  const result = z
    .string()
    // Zod's native url() validator is not RFC 3987-compliant
    .refine((arg: string) => {
      const error = validateIri(arg, IriValidationStrategy.Pragmatic);
      return error === undefined;
    })
    .safeParse(value);

  return result.success;
}
