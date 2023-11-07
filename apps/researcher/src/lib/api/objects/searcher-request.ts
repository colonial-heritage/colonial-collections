export function buildAggregation(id: string) {
  const aggregation = {
    terms: {
      size: 10000, // TBD: revisit this - return fewer terms instead
      field: id,
    },
  };

  return aggregation;
}
