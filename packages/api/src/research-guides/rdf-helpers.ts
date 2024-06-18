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

export function createResearchGuide(
  researchGuideResource: Resource,
  stackSize = 1
) {
  const identifier = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:identifier')
  );
  const name = onlyOne(getPropertyValues(researchGuideResource, 'ex:name'));
  const abstract = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:abstract')
  );
  const text = onlyOne(getPropertyValues(researchGuideResource, 'ex:text'));
  const encodingFormat = onlyOne(
    getPropertyValues(researchGuideResource, 'ex:encodingFormat')
  );

  let seeAlso: ResearchGuide[] | undefined = undefined;

  // Prevent infinite recursion
  if (stackSize < 4) {
    seeAlso = createResearchGuides(
      researchGuideResource,
      'ex:seeAlso',
      stackSize + 1
    );
  }

  const contentLocations = createPlaces(
    researchGuideResource,
    'ex:contentLocation'
  );
  const keywords = createThings<Term>(researchGuideResource, 'ex:keyword');
  const citations = createCitations(researchGuideResource, 'ex:citation');

  const researchGuideWithUndefinedValues: ResearchGuide = {
    id: researchGuideResource.value,
    identifier,
    name,
    abstract,
    text,
    encodingFormat,
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
