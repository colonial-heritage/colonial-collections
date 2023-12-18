import {Agent, Dataset, Image, License, Place, TimeSpan} from '../definitions';
import {getProperty, getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

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

function createImage(imageResource: Resource) {
  const contentUrl = getPropertyValue(imageResource, 'ex:contentUrl');

  const image: Image = {
    id: imageResource.value,
    contentUrl: contentUrl!, // Ignore 'string | undefined' warning - it's always set
  };

  // An image may not have a license
  const licenseResource = getProperty(imageResource, 'ex:license');
  if (licenseResource !== undefined) {
    const name = getPropertyValue(licenseResource, 'ex:name');
    const license: License = {
      id: licenseResource.value,
      name,
    };
    image.license = license;
  }

  return image;
}

export function createImages(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const images = properties.map(property => createImage(property));

  return images.length > 0 ? images : undefined;
}

function createPlace(placeResource: Resource) {
  const name = getPropertyValue(placeResource, 'ex:name');

  const place: Place = {
    id: placeResource.value,
    name,
  };

  // Recursively get the parent place(s), if any
  const parentPlace = getProperty(placeResource, 'ex:isPartOf');
  if (parentPlace !== undefined) {
    place.isPartOf = createPlace(parentPlace);
  }

  return place;
}

export function createPlaces(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const places = properties.map(property => createPlace(property));

  return places.length > 0 ? places : undefined;
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
  const rawStartDate = getPropertyValue(timeSpanResource, 'ex:startDate');
  const startDate = fromStringToDate(rawStartDate);

  const rawEndDate = getPropertyValue(timeSpanResource, 'ex:endDate');
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
