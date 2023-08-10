import {ontologyUrl, Agent, Image} from '../definitions';
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
