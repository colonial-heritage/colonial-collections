import {ontologyUrl, Agent, Image} from './definitions';
import type {Resource} from 'rdf-object';

export function getPropertyValue(resource: Resource, propertyName: string) {
  const property = resource.property[propertyName];
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

  return images;
}

export function onlyOne<T>(items: T[] | undefined) {
  if (Array.isArray(items)) {
    return items.shift(); // Undefined if array is empty
  }
  return undefined;
}
