'use client'; // Error components must be Client components

import {useEffect} from 'react';

export default function Error({error}: {error: Error}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div data-testid="error">
      <h2>Something went wrong!</h2>
    </div>
  );
}
