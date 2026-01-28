/**
 * Find price-matching or nearby properties
 * @param {Array} data - Array of objects with a `price` key
 * @param {Number} targetPrice - Price user searched for (pass null if using min/max)
 * @param {Object} options - Optional settings
 * @returns {Object} - Matches and message
 */
function findPriceMatches(data, targetPrice, options = {}) {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array.');
  }

  const {
    tolerancePercent = 0.2,
    fixedRange = null,
    min = null,
    max = null,
    limit = 10,
    priceKey = 'price',
    sort = 'closest' // 'closest', 'asc', 'desc'
  } = options;

  // Filter out invalid entries first
  const validData = data.filter(item => {
    return item && typeof item === 'object' && !isNaN(parseFloat(item[priceKey]));
  });

  // Calculate Range
  let minPrice, maxPrice;
  const price = parseFloat(targetPrice);
  const hasTarget = !isNaN(price);

  if (min !== null || max !== null) {
    // Explicit range mode
    minPrice = min !== null ? min : -Infinity;
    maxPrice = max !== null ? max : Infinity;
  } else if (hasTarget) {
    // Target price mode
    if (fixedRange !== null) {
      minPrice = price - fixedRange;
      maxPrice = price + fixedRange;
    } else {
      minPrice = price * (1 - tolerancePercent);
      maxPrice = price * (1 + tolerancePercent);
    }
  } else {
    throw new Error('Must provide either a targetPrice or min/max options.');
  }

  // Find Matches
  const matches = validData.filter(p => {
    const val = parseFloat(p[priceKey]);
    return val >= minPrice && val <= maxPrice;
  });

  // Check for Exact Match (only relevant if targetPrice is provided)
  let exactMatchFound = false;
  if (hasTarget) {
    exactMatchFound = matches.some(p => parseFloat(p[priceKey]) === price);
  }

  // Sorting
  matches.sort((a, b) => {
    const valA = parseFloat(a[priceKey]);
    const valB = parseFloat(b[priceKey]);

    if (sort === 'asc') {
      return valA - valB;
    } else if (sort === 'desc') {
      return valB - valA;
    } else {
      // Default: 'closest' (only works if we have a targetPrice)
      if (hasTarget) {
        return Math.abs(valA - price) - Math.abs(valB - price);
      }
      return valA - valB; // Fallback to asc if no target to be close to
    }
  });

  const slicedMatches = matches.slice(0, limit);

  let message = "Matches found.";
  if (hasTarget) {
    if (exactMatchFound) {
      message = "Exact matches found.";
    } else if (slicedMatches.length > 0) {
      message = "No exact match. Showing nearby price matches.";
    } else {
      message = "No matches found near this price.";
    }
  } else {
    if (slicedMatches.length === 0) {
      message = "No matches found in this range.";
    }
  }

  return {
    matches: slicedMatches,
    count: matches.length, // total matches before slice
    exact: exactMatchFound,
    message
  };
}

module.exports = {
  findPriceMatches
};
