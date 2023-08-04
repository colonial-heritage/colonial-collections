import {PostalAddress} from '../definitions';
import {getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

export function createAddressFromProperty(
  resource: Resource,
  propertyName: string
) {
  const property = resource.property[propertyName];
  if (property === undefined) {
    return undefined;
  }

  const postalAddress: PostalAddress = {
    id: property.value,
    streetAddress: getPropertyValue(property, 'cc:streetAddress')!,
    postalCode: getPropertyValue(property, 'cc:postalCode')!,
    addressLocality: getPropertyValue(property, 'cc:addressLocality')!,
    addressCountry: getPropertyValue(property, 'cc:addressCountry')!,
  };

  return postalAddress;
}
