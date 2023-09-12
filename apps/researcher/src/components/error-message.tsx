interface Props {
  error: string;
  testId?: string;
}

export default function ErrorMessage({error, testId = 'error'}: Props) {
  return <div data-testid={testId}>{error}</div>;
}
