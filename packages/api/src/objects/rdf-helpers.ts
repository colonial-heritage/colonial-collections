import {Image, License} from '../definitions';
import {getProperty, getPropertyValue} from '../rdf-helpers';
import type {Resource} from 'rdf-object';

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
