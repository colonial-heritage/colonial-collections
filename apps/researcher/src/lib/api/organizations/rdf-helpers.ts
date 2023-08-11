import {PostalAddress} from '../definitions';
import {getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

function createAddress(addressResource: Resource) {
  // Ignore TS 'undefined' warnings - the properties always exist
  const postalAddress: PostalAddress = {
    id: addressResource.value,
    streetAddress: getPropertyValue(addressResource, 'cc:streetAddress')!,
    postalCode: getPropertyValue(addressResource, 'cc:postalCode')!,
    addressLocality: getPropertyValue(addressResource, 'cc:addressLocality')!,
    addressCountry: getPropertyValue(addressResource, 'cc:addressCountry')!,
  };

  return postalAddress;
}

export function createAddresses(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const addresses = properties.map(property => createAddress(property));

  return addresses.length > 0 ? addresses : undefined;
}
