import type {Resource} from 'rdf-object';

export function onlyOne<T>(items: T[] | undefined) {
  if (Array.isArray(items)) {
    return items.shift(); // Undefined if array is empty
  }
  return undefined;
}

export function getPropertyValue(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}

function createThing<T>(thingResource: Resource) {
  const name = getPropertyValue(thingResource, 'ex:name');

  const thing = {
    id: thingResource.value,
    name,
  };

  return thing as T;
}

export function createThings<T>(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const things = properties.map(property => createThing<T>(property));

  return things.length > 0 ? things : undefined;
}

function createDate(resource: Resource) {
  const date = new Date(resource.term.value);

  return date;
}

export function createDates(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const dates = properties.map(property => createDate(property));

  return dates.length > 0 ? dates : undefined;
}
