# price-scout

Smart price range search for real estate, products, and any listings.

---

## 📦 Install

```bash
npm install price-scout


const { findPriceMatches } = require('price-scout');

const properties = [
  { id: 1, price: 100000 },
  { id: 2, price: 150000 },
  { id: 3, price: 200000 },
];

const result = findPriceMatches(properties, 180000, {
  tolerancePercent: 0.15,
  limit: 5,
});

console.log(result.message);
console.log(result.matches);
