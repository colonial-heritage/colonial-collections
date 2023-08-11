import {ontologyUrl, Agent, Dataset, Image, TimeSpan} from '../definitions';
import {getProperty, getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

function createThingFromProperty<T>(thingResource: Resource) {
  const name = getPropertyValue(thingResource, 'cc:name');

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

function createAgent(agentResource: Resource) {
  const type = getPropertyValue(agentResource, 'rdf:type');
  const name = getPropertyValue(agentResource, 'cc:name');

  let shorthandType = undefined;
  if (type === `${ontologyUrl}Person`) {
    shorthandType = 'Person' as const;
  } else if (type === `${ontologyUrl}Organization`) {
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

function createImage(imageResource: Resource) {
  const contentUrl = getPropertyValue(imageResource, 'cc:contentUrl');

  const image: Image = {
    id: imageResource.value,
    contentUrl: contentUrl!, // Ignore 'string | undefined' warning - it's always set
  };

  return image;
}

export function createImages(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const images = properties.map(property => createImage(property));

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

export function createTimeSpan(timeSpanResource: Resource) {
  const rawStartDate = getPropertyValue(timeSpanResource, 'cc:startDate');
  const startDate = fromStringToDate(rawStartDate);

  const rawEndDate = getPropertyValue(timeSpanResource, 'cc:endDate');
  const endDate = fromStringToDate(rawEndDate);

  const timeSpan: TimeSpan = {
    id: timeSpanResource.value,
    startDate,
    endDate,
  };

  return timeSpan;
}

export function createTimeSpans(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const timeSpans = properties.map(property => createTimeSpan(property));

  return timeSpans.length > 0 ? timeSpans : undefined;
}

function createDataset(datasetResource: Resource) {
  const name = getPropertyValue(datasetResource, 'cc:name');

  const publisherResource = getProperty(datasetResource, 'cc:publisher');
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
