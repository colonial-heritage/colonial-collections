export function buildAggregation(id: string) {
  const aggregation = {
    terms: {
      size: 1000, // TBD: what's a good size?
      field: `${id}.keyword`,
      // Sort by key in ascending order: ['Amersfoort', 'Delft', ...]
      // TBD: this no longer works if we have IRIs of terms (e.g. subjects) instead of
      // their current literals. We can only use this ordering for dates then
      order: {_key: 'asc'},
    },
  };

  return aggregation;
}
