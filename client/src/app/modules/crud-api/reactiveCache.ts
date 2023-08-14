import {Subject} from 'rxjs';

/**
 * A mapped cached which accepts anything as a key. This is accomplished by serializing the values using
 * `JSON.stringify`. Objects go through the extra step of having their properties
 * sorted to ensure their order.
 * @template K - How the cache should be indexed
 * @template T - The type that will be cached
 */
export class ReactiveCache<K, T> {
	/** This is where everything is actually stored */
	private store = new Map<string, T>();

	events = new Subject<T[]>();

	/** Tuple array of keys & values */
	get entries(): [K, T][] { return [...this.store.entries()].map(([key, val]) => [!key ? key : JSON.parse(key), val]) }
	/** Cache keys in use */
	get keys(): K[] { return [...this.store.keys()].map(k => !k ? k : JSON.parse(k)); }
	/** Number of cached items */
	get size(): number { return this.store.size; }
	/** Returns all the stored rows */
	get values(): T[] { return [...this.store.values()]; }

	/**
	 * Serializes anything with order guaranteed (Array positions wont change & object properties are sorted)
	 * @param value - Anything that needs to be serialized
	 * @returns {string} - The serialized version of the data
	 * @private
	 */
	private static serialize(value: any) {
		const _serialize: (value: any) => string = (value: any) => {
			if(Array.isArray(value)) return value.map(v => _serialize(v));
			if(value != null && typeof value == 'object') return Object.keys(value).sort()
				.reduce((acc, key) => ({...acc, [key]: _serialize(value[key])}), {});
			return value;
		};
		return JSON.stringify(_serialize(value));
	}

	/** Clear everything from the cache */
	clear() {
		this.store.clear();
		this.events.next(this.values);
	}

	/**
	 * Delete a cached value
	 * @param {K} key - Cache key
	 */
	delete(key: K) {
		this.store.delete(ReactiveCache.serialize(key));
		this.events.next(this.values);
	}

	/**
	 * Find a value stored in the cache
	 * @param {K} key - Cache key
	 * @returns {T | undefined} - The cached value, or undefined if nothing is cached under the provided key
	 */
	get(key: K): T | undefined { return this.store.get(ReactiveCache.serialize(key)); }

	/**
	 * Check if the cache key has an attached value
	 * @param {K} key - Cache key
	 * @returns {boolean} - True if cached
	 */
	has(key: K): boolean { return this.store.has(ReactiveCache.serialize(key)); }

	/**
	 * Store a value in the cache with a cache key
	 * @param {K} key - Index to store the value under
	 * @param {T} value - What you will be storing
	 */
	set(key: K, value: T) {
		this.store.set(ReactiveCache.serialize(key), value);
		this.events.next(this.values);
		return value;
	}
}

// export class ApiCache<K, T> {
// 	cache = new Map<K, T>();
// 	pending = new Map<K, Promise<T>>();
//
// 	get(key: K, fetchFn: (key: K) => Promise<T>) {
// 		if(this.cache[key]) return Promise.reject(this.cache[key]);
// 		if(this.pending[key]) return this.pending[key];
// 		return fetchFn(key).then(res => {
// 			this.cache[key] = res;
// 			return res;
// 		}).finally(() => this.pending[key] = undefined);
// 	}
// }
