const YEA = "1";
const NAY = "2";

export const compute_leg_sup_opp = (dataset) => {
  const result = dataset.legislators.map((legislator) => {
    const resultMap = dataset.vote_results
      .filter((result) => result.legislator_id === legislator.id)
      .reduce(
        (map, result) => {
          if (result.vote_type === YEA) {
            map.num_supported_bills += 1;
          }
          if (result.vote_type === NAY) {
            map.num_opposed_bills += 1;
          }
          return map;
        },
        { num_supported_bills: 0, num_opposed_bills: 0 }
      );
    return {
      id: legislator.id,
      name: legislator.name,
      num_supported_bills: resultMap.num_supported_bills,
      num_opposed_bills: resultMap.num_opposed_bills,
    };
  });

  return result;
};
