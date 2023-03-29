export function buildAggregation(id: string) {
  const aggregation = {
    terms: {
      size: 100, // TBD: what's a good size?,
      field: `${id}.keyword`,
    },
  };

  return aggregation;
}
