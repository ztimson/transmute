/**
 *  Removes any null values from an object in-place
 *
 * @example
 * ```ts
 * let test = {a: 0, b: false, c: null, d: 'abc'}
 * console.log(clean(test)); // Output: {a: 0, b: false, d: 'abc'}
 * ```
 *
 * @param {T} obj Object reference that will be cleaned
 * @returns {Partial<T>} Cleaned object
 */
export function clean<T>(obj: T): Partial<T> {
	if(obj == null) throw new Error("Cannot clean a NULL value");
	Object.entries(obj).forEach(([key, value]) => {
		if(value == null) delete (<any>obj)[key];
	});
	return <any>obj;
}

/**
 * Create a deep copy of an object (vs. a shallow copy of references)
 *
 * Should be replaced by `structuredClone` once released.
 *
 * @param {T} value Object to copy
 * @returns {T} Type
 */
export function deepCopy<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

/**
 * Get/set a property of an object using dot notation
 *
 * @example
 * ```ts
 * // Get a value
 * const name = dotNotation<string>(person, 'firstName');
 * const familyCarMake = dotNotation(family, 'cars[0].make');
 * // Set a value
 * dotNotation(family, 'cars[0].make', 'toyota');
 * ```
 *
 * @type T Return type
 * @param {Object} obj source object to search
 * @param {string} prop property name (Dot notation & indexing allowed)
 * @param {any} set  Set object property to value, omit to fetch value instead
 * @return {T} property value
 */
export function dotNotation<T>(obj: any, prop: string, set: T): T;
export function dotNotation<T>(obj: any, prop: string): T | undefined;
export function dotNotation<T>(obj: any, prop: string, set?: T): T | undefined {
	if(obj == null || !prop) return undefined;
	// Split property string by '.' or [index]
	return <T>prop.split(/[.[\]]/g).filter(prop => prop.length).reduce((obj, prop,  i, arr) => {
		if(prop[0] == '"' || prop[0] == "'") prop = prop.slice(1, -1); // Take quotes out
		if(!obj?.hasOwnProperty(prop)) {
			if(set == undefined) return undefined;
			obj[prop] = {};
		}
		if(set !== undefined && i == arr.length - 1)
			return obj[prop] = set;
		return obj[prop];
	}, obj);
}

/**
 * Check that an object has the following values
 *
 * @example
 * ```ts
 * const test = {a: 2, b: 2};
 * includes(test, {a: 1}); // true
 * includes(test, {b: 1, c: 3}); // false
 * ```
 *
 * @param target Object to search
 * @param values Criteria to check against
 * @param allowMissing Only check the keys that are available on the target
 * @returns {boolean} Does target include all the values
 */
export function includes(target: any, values: any, allowMissing = false): boolean {
	if(target == undefined) return allowMissing;
	if(Array.isArray(values)) return values.findIndex((e, i) => !includes(target[i], values[i], allowMissing)) == -1;
	const type = typeof values;
	if(type != typeof target) return false;
	if(type == 'object') {
		return Object.keys(values).find(key => !includes(target[key], values[key], allowMissing)) == null;
	}
	if(type == 'function') return target.toString() == values.toString();
	return target == values;
}

/**
 * Deep check if two objects are equal
 *
 * @param {any} a - first item to compare
 * @param {any} b - second item to compare
 * @returns {boolean} True if they match
 */
export function isEqual(a: any, b: any): boolean {
	const ta = typeof a, tb = typeof b;
	if((ta != 'object' || a == null) || (tb != 'object' || b == null))
		return ta == 'function' && tb == 'function' ? a.toString() == b.toString() : a === b;
	const keys = Object.keys(a);
	if(keys.length != Object.keys(b).length) return false;
	return Object.keys(a).every(key => isEqual(a[key], b[key]));
}
