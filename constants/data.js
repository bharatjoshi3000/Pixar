const categories = [
    "backgrounds",
    "fashion",
    "nature",
    "science",
    "education",
    "feelings",
    "health",
    "people",
    "religion",
    "places",
    "animals",
    "industry",
    "computer",
    "food",
    "sports",
    "transportation",
    "travel",
    "buildings",
    "business",
    "music",
  ];
  
  const filters = {
    order: ["popular", "latest"],
    orientation: ["horizontal", "vertical"],
    type: ["photo", "illustration", "vector"],
    colors: [
      "red",
      "orange",
      "yellow",
      "green",
      "turquoise",
      "blue",
      // "lilac",
      "pink",
      "white",
      "gray",
      "black",
      "brown",
    ],
  };
  
  const data = {
    categories,
    filters,
  };
  
  export default data;