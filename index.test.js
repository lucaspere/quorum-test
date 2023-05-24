import test from "ava";
import { compute_bill_sup_opp, compute_leg_sup_opp } from "./index.js";

const dataset = {
  bills: [
    {
      id: "2952375",
      title: "H.R. 5376: Build Back Better Act",
      sponsor_id: "412211",
    },
    {
      id: "2900994",
      title: "H.R. 3684: Infrastructure Investment and Jobs Act",
      sponsor_id: "1603850",
    },
  ],
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

test("should compute legislator support and oppose", (t) => {
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

test("should compute bill supporters and opposers", (t) => {
  const result = compute_bill_sup_opp(dataset);
  const expected = [
    {
      id: "2952375",
      title: "H.R. 5376: Build Back Better Act",
      supporter_count: 0,
      opposer_count: 2,
      primary_sponsor: "Unknown",
    },
    {
      id: "2900994",
      title: "H.R. 3684: Infrastructure Investment and Jobs Act",
      supporter_count: 1,
      opposer_count: 1,
      primary_sponsor: "Rep. Jamaal Bowman (D-NY-16)",
    },
  ];

  t.deepEqual(result, expected);
});
