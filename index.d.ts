/**
 * Options for finding price matches.
 */
export interface PriceMatchOptions {
    /**
     * Percentage of tolerance for the price range (e.g., 0.2 for 20%).
     * Ignored if fixedRange is provided.
     * Default: 0.2
     */
    tolerancePercent?: number;

    /**
     * Fixed amount to add/subtract from target price to create range.
     * Overrides tolerancePercent.
     * Default: null
     */
    fixedRange?: number | null;

    /**
     * Minimum price for explicit range search.
     * If provided, overrides targetPrice logic.
     * Default: null
     */
    min?: number | null;

    /**
     * Maximum price for explicit range search.
     * If provided, overrides targetPrice logic.
     * Default: null
     */
    max?: number | null;

    /**
     * maximum number of results to return.
     * Default: 10
     */
    limit?: number;

    /**
     * The key in the data objects that holds the price value.
     * Default: 'price'
     */
    priceKey?: string;

    /**
     * Sorting order for results.
     * 'closest': Closest to target price (requires targetPrice).
     * 'asc': Low to High.
     * 'desc': High to Low.
     * Default: 'closest'
     */
    sort?: 'closest' | 'asc' | 'desc';
}

/**
 * Result object returned by findPriceMatches.
 */
export interface PriceMatchResult<T> {
    /** Array of matching objects */
    matches: T[];
    /** Total number of matches found before slicing by limit */
    count: number;
    /** Whether an exact match to the target price was found */
    exact: boolean;
    /** Human-readable message describing the result */
    message: string;
}

/**
 * Find price-matching or nearby properties/items.
 *
 * @param data - Array of objects to search.
 * @param targetPrice - The target price to search for. Pass null if using simple min/max range.
 * @param options - Configuration options.
 */
export function findPriceMatches<T = any>(
    data: T[],
    targetPrice: number | null,
    options?: PriceMatchOptions
): PriceMatchResult<T>;
