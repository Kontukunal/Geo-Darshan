export const getRecommendations = (destinations, preferences) => {
  if (!preferences) return [];

  const { interests = [], activities = [], budget = "" } = preferences;

  const budgetMap = {
    budget: 1,
    "mid-range": 2,
    luxury: 3,
    "ultra-luxury": 4,
  };

  const priceValue = {
    $: 1,
    $$: 2,
    $$$: 3,
    $$$$: 4,
  };

  const allowedBudgetLevel = budgetMap[budget];

  return destinations
    .filter((dest) => {
      const destBudget = priceValue[dest.price];
      return !budget || destBudget <= allowedBudgetLevel;
    })
    .map((dest) => {
      let score = 0;
      const tags = dest.tags?.map((tag) => tag.toLowerCase()) || [];

      score += interests.filter((interest) =>
        tags.includes(interest.toLowerCase())
      ).length;

      score += activities.filter((activity) =>
        tags.includes(activity.toLowerCase())
      ).length;

      return { ...dest, score };
    })
    .filter((dest) => dest.score > 0)
    .sort((a, b) => b.score - a.score);
};
