import {Agent} from './definitions';
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

function createDate(resource: Resource) {
  const date = new Date(resource.term.value);

  return date;
}

export function createDates(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const dates = properties.map(property => createDate(property));

  return dates.length > 0 ? dates : undefined;
}

function createAgent(agentResource: Resource) {
  const name = getPropertyValue(agentResource, 'ex:name');

  const agent: Agent = {
    id: agentResource.value,
    name,
  };

  return agent;
}

export function createAgents(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const agents = properties.map(property => createAgent(property));

  return agents.length > 0 ? agents : undefined;
}
