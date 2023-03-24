export function buildAggregation(id: string, name: string) {
  const aggregation = {
    // Aggregate the hits by ID and name (for display)
    multi_terms: {
      size: 100, // TBD: what's a good size?
      terms: [{field: `${id}.keyword`}, {field: `${name}.keyword`}],
    },
  };

  return aggregation;
}
