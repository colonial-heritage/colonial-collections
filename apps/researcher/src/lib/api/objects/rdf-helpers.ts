import {ontologyUrl, Agent, Image, TimeSpan} from '../definitions';
import {getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

function createThingFromProperty<T>(resource: Resource) {
  const name = getPropertyValue(resource, 'cc:name');

  const thing = {
    id: resource.value,
    name,
  };

  return thing as T;
}

export function createThingsFromProperties<T>(
  resource: Resource,
  propertyName: string
) {
  const properties = resource.properties[propertyName];
  const things = properties.map(property =>
    createThingFromProperty<T>(property)
  );

  return things.length > 0 ? things : undefined;
}

function createAgentFromProperties(resource: Resource) {
  const type = getPropertyValue(resource, 'rdf:type');
  const name = getPropertyValue(resource, 'cc:name');

  let shorthandType = undefined;
  if (type === `${ontologyUrl}Person`) {
    shorthandType = 'Person' as const;
  } else if (type === `${ontologyUrl}Organization`) {
    shorthandType = 'Organization' as const;
  } else {
    shorthandType = 'Unknown' as const;
  }

  const agent: Agent = {
    type: shorthandType,
    id: resource.value,
    name,
  };

  return agent;
}

export function createAgentsFromProperties(
  resource: Resource,
  propertyName: string
) {
  const properties = resource.properties[propertyName];
  const agents = properties.map(property =>
    createAgentFromProperties(property)
  );

  return agents.length > 0 ? agents : undefined;
}

function createImageFromProperties(resource: Resource) {
  const contentUrl = getPropertyValue(resource, 'cc:contentUrl');

  const image: Image = {
    id: resource.value,
    contentUrl: contentUrl!, // Ignore 'string | undefined' warning - it's always set
  };

  return image;
}

export function createImagesFromProperties(
  resource: Resource,
  propertyName: string
) {
  const properties = resource.properties[propertyName];
  const images = properties.map(property =>
    createImageFromProperties(property)
  );

  return images.length > 0 ? images : undefined;
}

function fromStringToDate(dateValue: string | undefined) {
  // TBD: change 'Date' to string to allow for uncertain dates (e.g. EDTF)?
  let date: Date | undefined;
  if (dateValue !== undefined) {
    date = new Date(dateValue);
  }

  return date;
}

export function createTimeSpanFromProperties(resource: Resource) {
  const rawStartDate = getPropertyValue(resource, 'cc:startDate');
  const startDate = fromStringToDate(rawStartDate);

  const rawEndDate = getPropertyValue(resource, 'cc:endDate');
  const endDate = fromStringToDate(rawEndDate);

  const timeSpan: TimeSpan = {
    id: resource.value,
    startDate,
    endDate,
  };

  return timeSpan;
}

export function createTimeSpansFromProperties(
  resource: Resource,
  propertyName: string
) {
  const properties = resource.properties[propertyName];
  const timeSpans = properties.map(property =>
    createTimeSpanFromProperties(property)
  );

  return timeSpans.length > 0 ? timeSpans : undefined;
}

export function onlyOne<T>(items: T[] | undefined) {
  if (Array.isArray(items)) {
    return items.shift(); // Undefined if array is empty
  }
  return undefined;
}
