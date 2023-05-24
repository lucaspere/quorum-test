import test from "ava";
import { compute_leg_sup_opp } from "./index.js";

const dataset = {
  legislators: [
    { id: "904789", name: "Rep. Don Bacon (R-NE-2)" },
    { id: "1603850", name: "Rep. Jamaal Bowman (D-NY-16)" },
  ],
  vote_results: [
    {
      id: "92516784",
      legislator_id: "904789",
      vote_id: "3321166",
      vote_type: "2",
    },
    {
      id: "92516770",
      legislator_id: "1603850",
      vote_id: "3321166",
      vote_type: "2",
    },
    {
      id: "92279943",
      legislator_id: "904789",
      vote_id: "3314452",
      vote_type: "2",
    },
    {
      id: "92279920",
      legislator_id: "1603850",
      vote_id: "3314452",
      vote_type: "1",
    },
  ],
  votes: [
    { id: "3314452", bill_id: "2900994" },
    { id: "3321166", bill_id: "2952375" },
  ],
};

test("should count legislator support", (t) => {
  const result = compute_leg_sup_opp(dataset);
  const expected = [
    {
      id: "904789",
      name: "Rep. Don Bacon (R-NE-2)",
      num_supported_bills: 0,
      num_opposed_bills: 2,
    },
    {
      id: "1603850",
      name: "Rep. Jamaal Bowman (D-NY-16)",
      num_supported_bills: 1,
      num_opposed_bills: 1,
    },
  ];

  t.deepEqual(result, expected);
});
