export function buildAggregation(id: string) {
  const aggregation = {
    terms: {
      size: 1000, // TBD: what's a good size?
      field: `${id}.keyword`,
      // Sort by key in ascending order: ['Amersfoort', 'Delft', ...]
      // TBD: update as soon as we have IRIs of terms, such as places
      order: {_key: 'asc'},
    },
  };

  return aggregation;
}
