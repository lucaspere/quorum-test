const YEA = "1";
const NAY = "2";

export const compute_leg_sup_opp = (dataset) => {
  const result = dataset.legislators.map((legislator) => {
    const resultMap = dataset.vote_results
      .filter((result) => result.legislator_id === legislator.id)
      .reduce(
        (map, { vote_type }) => map.set(vote_type, map.get(vote_type) + 1),
        new Map([
          [YEA, 0],
          [NAY, 0],
        ])
      );
    return {
      id: legislator.id,
      name: legislator.name,
      num_supported_bills: resultMap.get(YEA),
      num_opposed_bills: resultMap.get(NAY),
    };
  });

  return result;
};
