import {Agent, Dataset, Measurement, Place, TimeSpan} from './definitions';
import {defu} from 'defu';
import edtf from 'edtf';
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

function createPlace(placeResource: Resource) {
  const name = getPropertyValue(placeResource, 'ex:name');
  const sameAs = getPropertyValue(placeResource, 'ex:sameAs');

  const place: Place = {
    id: placeResource.value,
    name,
    sameAs,
  };

  // Recursively get the parent place(s), if any
  const parentPlace = getProperty(placeResource, 'ex:isPartOf');
  if (parentPlace !== undefined) {
    place.isPartOf = createPlace(parentPlace);
  }

  const placeWithoutNullishValues = removeNullish<Place>(place);

  return placeWithoutNullishValues;
}

function createThing<T>(thingResource: Resource) {
  const name = getPropertyValue(thingResource, 'ex:name');
  const sameAs = getPropertyValue(thingResource, 'ex:sameAs');

  const thing = {
    id: thingResource.value,
    name,
    sameAs,
  };

  const thingWithoutNullishValues = removeNullish<T>(thing);

  return thingWithoutNullishValues as T;
}

export function createThings<T>(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const things = properties.map(property => createThing<T>(property));

  return things.length > 0 ? things : undefined;
}

export function createPlaces(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const places = properties.map(property => createPlace(property));

  return places.length > 0 ? places : undefined;
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

export function createTimeSpan(timeSpanResource: Resource) {
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

function createAgent(agentResource: Resource) {
  const type = getPropertyValue(agentResource, 'rdf:type');
  const name = getPropertyValue(agentResource, 'ex:name');

  let shorthandType = undefined;
  if (type === 'https://example.org/Person') {
    shorthandType = 'Person' as const;
  } else if (type === 'https://example.org/Organization') {
    shorthandType = 'Organization' as const;
  } else {
    shorthandType = 'Unknown' as const;
  }

  const agent: Agent = {
    id: agentResource.value,
    type: shorthandType,
    name,
  };

  return agent;
}

export function createAgents(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const agents = properties.map(property => createAgent(property));

  return agents.length > 0 ? agents : undefined;
}

function createDataset(datasetResource: Resource) {
  const name = getPropertyValue(datasetResource, 'ex:name');

  const publisherResource = getProperty(datasetResource, 'ex:publisher');
  const publisher =
    publisherResource !== undefined
      ? createAgent(publisherResource)
      : undefined;

  const dataset: Dataset = {
    id: datasetResource.value,
    name,
    publisher,
  };

  return dataset;
}

export function createDatasets(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const datasets = properties.map(property => createDataset(property));

  return datasets.length > 0 ? datasets : undefined;
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
