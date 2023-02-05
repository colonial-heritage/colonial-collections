export function buildAggregation(id: string, name: string) {
  const aggregation = {
    // Aggregate the hits by ID and name (for display)
    multi_terms: {
      terms: [{field: `${id}.keyword`}, {field: `${name}.keyword`}],
    },
  };

  return aggregation;
}
