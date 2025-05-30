/**
 * Find price-matching or nearby properties
 * @param {Array} data - Array of objects with a `price` key
 * @param {Number} targetPrice - Price user searched for
 * @param {Object} options - Optional settings
 * @returns {Object} - Matches and message
 */
function findPriceMatches(data, targetPrice, options = {}) {
  const {
    tolerancePercent = 0.2,
    fixedRange = null,
    limit = 10,
    priceKey = 'price'
  } = options;

  const price = parseFloat(targetPrice);
  if (isNaN(price)) {
    throw new Error('Invalid price input');
  }

  const exactMatches = data.filter(p => p[priceKey] === price);

  if (exactMatches.length > 0) {
    return { matches: exactMatches, exact: true, message: "Exact matches found." };
  }

  let minPrice, maxPrice;

  if (fixedRange !== null) {
    minPrice = price - fixedRange;
    maxPrice = price + fixedRange;
  } else {
    minPrice = price * (1 - tolerancePercent);
    maxPrice = price * (1 + tolerancePercent);
  }

  const nearbyMatches = data
    .filter(p => p[priceKey] >= minPrice && p[priceKey] <= maxPrice)
    .sort((a, b) => Math.abs(a[priceKey] - price) - Math.abs(b[priceKey] - price))
    .slice(0, limit);

  return {
    matches: nearbyMatches,
    exact: false,
    message: "No exact match. Showing nearby price matches."
  };
}

module.exports = {
  findPriceMatches
};
