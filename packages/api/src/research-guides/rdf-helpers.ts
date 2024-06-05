import {
  createPlaces,
  createThings,
  getPropertyValues,
  onlyOne,
  removeNullish,
} from '../rdf-helpers';
import type {Resource} from 'rdf-object';
import {Citation, ResearchGuide} from './definitions';
import {Term} from '../definitions';

function createCitation(citationResource: Resource) {
  const name = onlyOne(getPropertyValues(citationResource, 'ex:name'));
  const description = onlyOne(
    getPropertyValues(citationResource, 'ex:description')
  );
  const url = onlyOne(getPropertyValues(citationResource, 'ex:url'));

  const citation: Citation = {
    id: citationResource.value,
    name,
    description,
    url,
  };

  return citation;
}

export function createCitations(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const citations = properties.map(property => createCitation(property));

  return citations.length > 0 ? citations : undefined;
}

export function createResearchGuide(researchGuideResource: Resource) {
  const name = onlyOne(getPropertyValues(researchGuideResource, 'ex:name'));
  const abstract = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:abstract')
  );
  const text = onlyOne(getPropertyValues(researchGuideResource, 'ex:text'));
  const encodingFormat = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:encodingFormat')
  );
  const hasParts = createResearchGuides(researchGuideResource, 'ex:hasPart');
  const isPartOf = createResearchGuides(researchGuideResource, 'ex:isPartOf');
  const contentLocations = createPlaces(
    researchGuideResource,
    'ex:contentLocation'
  );
  const keywords = createThings<Term>(researchGuideResource, 'ex:keyword');
  const citations = createCitations(researchGuideResource, 'ex:citation');

  const researchGuideWithUndefinedValues: ResearchGuide = {
    id: researchGuideResource.value,
    name,
    abstract,
    text,
    encodingFormat,
    hasParts,
    isPartOf,
    contentLocations,
    keywords,
    citations,
  };

  const researchGuide = removeNullish<ResearchGuide>(
    researchGuideWithUndefinedValues
  );

  return researchGuide;
}

export function createResearchGuides(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const researchGuides = properties.map(property =>
    createResearchGuide(property)
  );

  return researchGuides.length > 0 ? researchGuides : undefined;
}
