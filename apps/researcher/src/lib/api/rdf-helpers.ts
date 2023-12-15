import {defu} from 'defu';
import type {Resource} from 'rdf-object';

export function getProperty(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property;
}

export function getPropertyValue(resource: Resource, propertyName: string) {
  const property = getProperty(resource, propertyName);
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}

export function getPropertyValues(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const values = properties.map(property => property.value);

  return values.length > 0 ? values : undefined;
}

export function onlyOne<T>(items: T[] | undefined) {
  if (Array.isArray(items)) {
    return items.shift(); // Undefined if array is empty
  }
  return undefined;
}

export function removeNullish<T>(objectWithNullishValues: object) {
  const object = defu(objectWithNullishValues, {});

  return object as T;
}
