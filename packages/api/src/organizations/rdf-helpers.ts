import {PostalAddress} from '../definitions';
import {getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

function createAddress(addressResource: Resource) {
  // Ignore TS 'undefined' warnings - the properties always exist
  const postalAddress: PostalAddress = {
    id: addressResource.value,
    streetAddress: getPropertyValue(addressResource, 'ex:streetAddress')!,
    postalCode: getPropertyValue(addressResource, 'ex:postalCode')!,
    addressLocality: getPropertyValue(addressResource, 'ex:addressLocality')!,
    addressCountry: getPropertyValue(addressResource, 'ex:addressCountry')!,
  };

  return postalAddress;
}

export function createAddresses(resource: Resource, propertyName: string) {
  const properties = resource.properties[propertyName];
  const addresses = properties.map(property => createAddress(property));

  return addresses.length > 0 ? addresses : undefined;
}
