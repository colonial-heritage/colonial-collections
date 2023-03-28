import {validateIri} from 'validate-iri';
import {z} from 'zod';

export function isIri(value: string) {
  const result = z
    .string()
    // Zod's native url() validator is not RFC 3987-compliant
    .refine((arg: string) => {
      const error = validateIri(arg);
      return error === undefined;
    })
    .safeParse(value);

  return result.success;
}

// Gets all RFC 3987-compliant IRIs from an object, regardless of the object's nesting
export function getIrisFromObject<T>(rootObject: T) {
  const iris: string[] = [];
  const stack = [rootObject];

  while (stack.length > 0) {
    const lastObject = stack.pop();
    if (lastObject === undefined) {
      break;
    }

    const currentObject = lastObject as object;
    Object.keys(currentObject).forEach(key => {
      const value = currentObject[key as keyof typeof currentObject];
      if (typeof value === 'string' && isIri(value)) {
        iris.push(value);
      } else if (typeof value === 'object' && value !== null) {
        stack.push(value);
      }
    });
  }

  return iris;
}
