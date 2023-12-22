const linkToCategory = link => {
  const categoryMap = {
    electronics: "Electronics",
    clothing: "Clothing",
    "home-garden": "Home & Garden",
    books: "Books",
    "health-beauty": "Health & Beauty",
    sports: "Sports",
    toys: "Toys",
    "cars-motorcycles": "Cars & Motorcycles",
    "groceries-food": "Groceries & Food",
    "office-supplies-stationery": "Office Supplies & Stationery",
  };

  return categoryMap[link] || null;
};

const categoryToLink = category => {
  const linkMap = {
    Electronics: "electronics",
    Clothing: "clothing",
    "Home & Garden": "home-garden",
    Books: "books",
    "Health & Beauty": "health-beauty",
    Sports: "sports",
    Toys: "toys",
    "Cars & Motorcycles": "cars-motorcycles",
    "Groceries & Food": "groceries-food",
    "Office Supplies & Stationery": "office-supplies-stationery",
  };

  return linkMap[category] || null;
};

const formatDate = dateString => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export { linkToCategory, categoryToLink, formatDate };
