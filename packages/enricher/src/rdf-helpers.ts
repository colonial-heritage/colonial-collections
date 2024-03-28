import {TimeSpan} from './definitions';
import edtf from 'edtf';
import type {Resource} from 'rdf-object';

export function getPropertyValue(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  return property.value;
}

export function onlyOne<T>(items: T[] | undefined) {
  if (Array.isArray(items)) {
    return items.shift(); // Undefined if array is empty
  }
  return undefined;
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

function fromStringToEdtf(dateValue: string | undefined) {
  if (dateValue !== undefined) {
    try {
      return edtf(dateValue);
    } catch (err) {
      // Ignore invalid dates
    }
  }

  return undefined;
}

function createTimeSpan(timeSpanResource: Resource) {
  const rawStartDate = getPropertyValue(timeSpanResource, 'ex:startDate');
  const startDate = fromStringToEdtf(rawStartDate);

  const rawEndDate = getPropertyValue(timeSpanResource, 'ex:endDate');
  const endDate = fromStringToEdtf(rawEndDate);

  const timeSpan: TimeSpan = {
    id: timeSpanResource.value,
    startDate: startDate !== undefined ? new Date(startDate.min) : undefined, // E.g. 1881 = 1881-01-01
    endDate: endDate !== undefined ? new Date(endDate.max) : undefined, // E.g. 1805 = 1805-12-31
  };

  return timeSpan;
}

export function createTimeSpans(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const timeSpans = properties.map(property => createTimeSpan(property));

  return timeSpans.length > 0 ? timeSpans : undefined;
}
