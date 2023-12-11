import type {Measurement} from './definitions';
import {defu} from 'defu';
import type {Resource} from 'rdf-object';

function getProperty(resource: Resource, propertyName: string) {
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

function createThingFromProperty<T>(thingResource: Resource) {
  const name = getPropertyValue(thingResource, 'ex:name');

  const thing = {
    id: thingResource.value,
    name,
  };

  return thing as T;
}

export function createThings<T>(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const things = properties.map(property =>
    createThingFromProperty<T>(property)
  );

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

export function createMeasurements(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const measurements = properties.map(property => {
    const measurementValue = property.property['ex:value'];
    const metric = property.property['ex:measurementOf'];
    const metricName = metric.property['ex:name'];
    const metricOrder = metric.property['ex:order'];

    const measurement: Measurement = {
      id: property.value,
      value: measurementValue.value === 'true', // May need to support other data types at some point
      metric: {
        id: metric.value,
        name: metricName.value,
        order: +metricOrder.value,
      },
    };

    return measurement;
  });

  // Sort measurements by metric order
  measurements.sort((a, b) => a.metric.order - b.metric.order);

  return measurements.length > 0 ? measurements : undefined;
}
