import { destinations } from "../data/destinations";

export const getTrendingDestinations = (limit = 4) => {
  return [...destinations]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
};
