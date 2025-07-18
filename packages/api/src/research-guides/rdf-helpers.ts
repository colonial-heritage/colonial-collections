import {
  createPlaces,
  createThings,
  createTimeSpan,
  getPropertyValues,
  onlyOne,
  removeNullish,
} from '../rdf-helpers';
import type {Resource} from 'rdf-object';
import {Citation, CitationType, ResearchGuide} from './definitions';
import {Event, Term} from '../definitions';

function createCitation(citationResource: Resource) {
  const name = onlyOne(getPropertyValues(citationResource, 'ex:name'));
  const description = onlyOne(
    getPropertyValues(citationResource, 'ex:description')
  );
  const url = onlyOne(getPropertyValues(citationResource, 'ex:url'));
  const additionalType = onlyOne(
    getPropertyValues(citationResource, 'ex:additionalType')
  );
  const inLanguage = getPropertyValues(citationResource, 'ex:inLanguage');
  const language = Array.isArray(inLanguage) ? inLanguage : [];

  // The KG, unfortunately, does not use structured data for denoting the
  // type of the source - we'll need to parse an unstructured literal
  const type = additionalType?.toLowerCase().includes('secondary source')
    ? CitationType.SecondarySource
    : CitationType.PrimarySource;

  const citation: Citation = {
    type,
    id: citationResource.value,
    name,
    description,
    url,
    inLanguage: language,
  };

  return citation;
}

export function createCitations(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const citations = properties.map(property => createCitation(property));

  return citations.length > 0 ? citations : undefined;
}

function createResearchGuides(
  resource: Resource,
  propertyName: string,
  stackSize: number
) {
  const properties = resource.properties[propertyName];
  const researchGuides = properties.map(property =>
    createResearchGuide(property, stackSize)
  );

  return researchGuides.length > 0 ? researchGuides : undefined;
}

function createEvent(eventResource: Resource) {
  const timespan = createTimeSpan(eventResource);

  const event: Event = {
    id: eventResource.value,
    date: timespan,
  };

  return event;
}

export function createEvents(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const events = properties.map(property => createEvent(property));

  return events.length > 0 ? events : undefined;
}

export function createResearchGuide(
  researchGuideResource: Resource,
  stackSize = 1
) {
  const name = onlyOne(getPropertyValues(researchGuideResource, 'ex:name'));
  const alternateNames = getPropertyValues(
    researchGuideResource,
    'ex:alternateName'
  );
  const abstract = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:abstract')
  );
  const text = onlyOne(getPropertyValues(researchGuideResource, 'ex:text'));
  const encodingFormat = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:encodingFormat')
  );

  let hasParts: ResearchGuide[] | undefined = undefined;

  // Prevent infinite recursion
  if (stackSize < 5) {
    hasParts = createResearchGuides(
      researchGuideResource,
      'ex:hasPart',
      stackSize + 1
    );
  }

  let seeAlso: ResearchGuide[] | undefined = undefined;

  // Prevent infinite recursion
  if (stackSize < 5) {
    seeAlso = createResearchGuides(
      researchGuideResource,
      'ex:seeAlso',
      stackSize + 1
    );
  }

  const contentReferenceTimes = createEvents(
    researchGuideResource,
    'ex:contentReferenceTime'
  );
  const contentLocations = createPlaces(
    researchGuideResource,
    'ex:contentLocation'
  );
  const keywords = createThings<Term>(researchGuideResource, 'ex:keyword');
  const citations = createCitations(researchGuideResource, 'ex:citation');

  const researchGuideWithUndefinedValues: ResearchGuide = {
    id: researchGuideResource.value,
    name,
    alternateNames,
    abstract,
    text,
    encodingFormat,
    contentReferenceTimes,
    hasParts,
    seeAlso,
    contentLocations,
    keywords,
    citations,
  };

  const researchGuide = removeNullish<ResearchGuide>(
    researchGuideWithUndefinedValues
  );

  return researchGuide;
}
