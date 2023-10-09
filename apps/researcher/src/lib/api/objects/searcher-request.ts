export function buildAggregation(id: string) {
  const aggregation = {
    terms: {
      size: 1000, // TBD: what's a good size?
      field: id,
      order: {_key: 'asc'},
    },
  };

  return aggregation;
}
