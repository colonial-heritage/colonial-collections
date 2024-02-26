import {PostalAddress} from '@/lib/api/definitions';
import dynamic from 'next/dynamic';

// Disable server-side rendering for the map component,
// because this component uses the window object.
const Map = dynamic(() => import('./map'), {
  ssr: false,
});

interface Props {
  address?: PostalAddress;
}

export default async function MapByAddress({address}: Props) {
  if (!address) {
    return null;
  }

  const addressString = [
    address.streetAddress,
    address.postalCode,
    address.addressLocality,
    address.addressCountry,
  ]
    .filter(n => n)
    .join(',');

  try {
    // The map component needs longitude and latitude to display the location.
    // We can use the OpenStreetMap API to get these coordinates from the address.
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        addressString
      )}`
    );

    const responseData = await response.json();
    const location = responseData[0];

    return <Map lat={location.lat} lon={location.lon} />;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}
