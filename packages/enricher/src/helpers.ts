import type {Resource} from 'rdf-object';

export function getPropertyValue(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}
