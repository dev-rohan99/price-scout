import { describe, it, expect } from 'vitest';
import { findPriceMatches } from '../index';

describe('findPriceMatches', () => {
    const sampleData = [
        { id: 1, price: 100 },
        { id: 2, price: 200 },
        { id: 3, price: 300 },
        { id: 4, price: 500 },
        { id: 5, price: 1000 },
    ];

    describe('Target Price Mode', () => {
        it('finds exact matches', () => {
            const result = findPriceMatches(sampleData, 200);
            expect(result.exact).toBe(true);
            expect(result.matches).toHaveLength(1);
            expect(result.matches[0].price).toBe(200);
            expect(result.message).toBe("Exact matches found.");
        });

        it('finds nearby matches within default tolerance', () => {
            // Target 210. 20% tolerance = 168 to 252. Should find 200.
            const result = findPriceMatches(sampleData, 210);
            expect(result.exact).toBe(false);
            expect(result.matches).toHaveLength(1);
            expect(result.matches[0].price).toBe(200);
            expect(result.message).toContain("No exact match");
        });

        it('finds matches with fixedRange', () => {
            // Target 400 +/- 100 => 300 to 500.
            const result = findPriceMatches(sampleData, 400, { fixedRange: 100 });
            expect(result.matches).toHaveLength(2); // 300 and 500
            const prices = result.matches.map(m => m.price).sort((a, b) => a - b);
            expect(prices).toEqual([300, 500]);
        });

        it('returns empty if nothing in range', () => {
            const result = findPriceMatches(sampleData, 800, { fixedRange: 50 });
            expect(result.matches).toHaveLength(0);
            expect(result.message).toBe("No matches found near this price.");
        });
    });

    describe('Explicit Min/Max Mode', () => {
        it('filters by min only', () => {
            const result = findPriceMatches(sampleData, null, { min: 400 });
            // Should be >= 400: 500, 1000
            expect(result.matches.length).toBe(2);
            expect(result.matches.some(m => m.price === 500)).toBe(true);
            expect(result.matches.some(m => m.price === 1000)).toBe(true);
        });

        it('filters by max only', () => {
            const result = findPriceMatches(sampleData, null, { max: 150 });
            // Should be <= 150: 100
            expect(result.matches.length).toBe(1);
            expect(result.matches[0].price).toBe(100);
        });

        it('filters by range [min, max]', () => {
            const result = findPriceMatches(sampleData, null, { min: 150, max: 350 });
            // Should be 200, 300
            expect(result.matches.length).toBe(2);
        });
    });

    describe('Sorting', () => {
        const sortData = [
            { price: 10 },
            { price: 50 },
            { price: 30 }
        ];

        it('sorts asc', () => {
            const result = findPriceMatches(sortData, null, { min: 0, sort: 'asc' });
            const prices = result.matches.map(m => m.price);
            expect(prices).toEqual([10, 30, 50]);
        });

        it('sorts desc', () => {
            const result = findPriceMatches(sortData, null, { min: 0, sort: 'desc' });
            const prices = result.matches.map(m => m.price);
            expect(prices).toEqual([50, 30, 10]);
        });

        it('sorts closest to target', () => {
            // Target 48. Closest: 50 (diff 2), then 30 (diff 18), then 10 (diff 38)
            const result = findPriceMatches(sortData, 48, { tolerancePercent: 1.0, sort: 'closest' });
            const prices = result.matches.map(m => m.price);
            expect(prices).toEqual([50, 30, 10]);
        });
    });

    describe('Validation', () => {
        it('throws if data is not array', () => {
            expect(() => findPriceMatches("not array", 100)).toThrow(/Data must be an array/);
        });

        it('throws if no target and no min/max', () => {
            expect(() => findPriceMatches(sampleData, null)).toThrow(/Must provide either a targetPrice/);
        });
    });
});
