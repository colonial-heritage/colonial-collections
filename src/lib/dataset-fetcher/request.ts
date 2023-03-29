const size = 100; // TBD: what's a good size?

export function buildMultiTermsAggregation(id: string, name: string) {
  const aggregation = {
    // Aggregate the hits by ID and name (for display)
    multi_terms: {
      size,
      terms: [{field: `${id}.keyword`}, {field: `${name}.keyword`}],
    },
  };

  return aggregation;
}

export function buildSingleTermAggregation(id: string) {
  const aggregation = {
    terms: {
      size,
      field: `${id}.keyword`,
    },
  };

  return aggregation;
}
