'use client'; // Error components must be Client components

interface Props {
  error: Error;
}

export default function Error({error}: Props) {
  console.error(error);

  return (
    <div data-testid="error">
      <h2>Something went wrong!</h2>
    </div>
  );
}
