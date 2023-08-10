import {PostalAddress} from '../definitions';
import {getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

function createAddressFromProperties(resource: Resource) {
  const postalAddress: PostalAddress = {
    id: resource.value,
    streetAddress: getPropertyValue(resource, 'cc:streetAddress')!,
    postalCode: getPropertyValue(resource, 'cc:postalCode')!,
    addressLocality: getPropertyValue(resource, 'cc:addressLocality')!,
    addressCountry: getPropertyValue(resource, 'cc:addressCountry')!,
  };

  return postalAddress;
}

export function createAddressesFromProperties(
  resource: Resource,
  propertyName: string
) {
  const properties = resource.properties[propertyName];
  const addresses = properties.map(property =>
    createAddressFromProperties(property)
  );

  return addresses.length > 0 ? addresses : undefined;
}
