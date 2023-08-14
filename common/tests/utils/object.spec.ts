import {clean, deepCopy, dotNotation, includes, isEqual} from "../../src";

describe('Object Utilities', () => {
	const TEST_OBJECT = {
		a: 1,
		b: [
			[2, 3],
			[4, 5]
		],
		c: {
			d: [
				[{e: 6, f: 7}]
			],
		},
		g: {h: 8},
		i: () => 9
	};

	describe('clean', () => {
		test('remove null properties', () => {
			const a = {a: 1, b: 2, c: null};
			const final = {a: 1, b: 2};
			expect(clean(a)).toEqual(final);
		});
	});

	describe('deepCopy', () => {
		const copy = deepCopy(TEST_OBJECT);
		test('Array of arrays', () => {
			const a = [[1, 2], [3, 4]];
			const b = deepCopy(a);
			b[0][1] = 5;
			expect(a).not.toEqual(b);
		});
		test('Change array inside object', () => {
			copy.b[1] = [1, 1, 1];
			expect(copy.b[1]).not.toEqual(TEST_OBJECT.b[1]);
		});
		test('Change object inside object', () => {
			copy.g = {h: Math.random()};
			expect(copy.g).not.toEqual(TEST_OBJECT.g);
		});
		test('Change object property inside nested array', () => {
			copy.c.d[0][0].e = -1;
			expect(copy.c.d[0][0].e).not.toEqual(TEST_OBJECT.c.d[0][0].e);
		});
	});

	describe('dotNotation', () => {
		test('no object or properties', () => {
			expect(dotNotation(undefined, 'z')).toStrictEqual(undefined);
			expect(dotNotation(TEST_OBJECT, '')).toStrictEqual(undefined);
		});
		test('invalid property', () => expect(dotNotation(TEST_OBJECT, 'z')).toBeUndefined());
		test('by property', () => expect(dotNotation(TEST_OBJECT, 'a')).toBe(TEST_OBJECT.a));
		test('by key', () => expect(dotNotation(TEST_OBJECT, '["a"]')).toBe(TEST_OBJECT['a']));
		test('by key (single quote)', () => expect(dotNotation(TEST_OBJECT, '[\'a\']')).toBe(TEST_OBJECT['a']));
		test('by key (double quote)', () => expect(dotNotation(TEST_OBJECT, '["a"]')).toBe(TEST_OBJECT['a']));
		test('by index', () => expect(dotNotation(TEST_OBJECT, 'b[0]')).toBe(TEST_OBJECT.b[0]));
		test('by index (2d)', () => expect(dotNotation(TEST_OBJECT, 'b[1][1]')).toBe(TEST_OBJECT.b[1][1]));
		test('everything combined', () => expect(dotNotation(TEST_OBJECT, 'c["d"][0][0].e'))
			.toBe(TEST_OBJECT.c['d'][0][0].e));
		test('set value', () => {
			const COPY = JSON.parse(JSON.stringify(TEST_OBJECT));
			dotNotation(COPY, 'c["d"][0][0].e', 'test');
			expect(COPY['c']['d'][0][0]['e']).toBe('test');
		});
		test('set new value', () => {
			const COPY = JSON.parse(JSON.stringify(TEST_OBJECT));
			dotNotation(COPY, 'c.x.y.z', 'test');
			expect(COPY['c']['x']['y']['z']).toBe('test');
		});
	});

	describe('includes', () => {
		test('simple', () => expect(includes(TEST_OBJECT, {a: 1})).toBeTruthy());
		test('nested', () => expect(includes(TEST_OBJECT, {g: {h: 8}})).toBeTruthy());
		test('array', () => expect(includes(TEST_OBJECT, {b: [[2]]})).toBeTruthy());
		test('nested array', () => expect(includes(TEST_OBJECT, {a: 1, c: {d: [[{e: 6}]]}})).toBeTruthy());
		test('wong nested array', () => expect(includes(TEST_OBJECT, {a: 1, c: {d: [{e: 7}]}})).toBeFalsy());
		test('wrong value', () => expect(includes(TEST_OBJECT, {a: 1, b: 2})).toBeFalsy());
		test('missing value', () => expect(includes(TEST_OBJECT, {a: 1, i: 10})).toBeFalsy());
	});

	describe('isEqual', () => {
		test('boolean equal', () => expect(isEqual(true, true)).toBeTruthy());
		test('boolean not-equal', () => expect(isEqual(true, false)).toBeFalsy());
		test('number equal', () => expect(isEqual(1, 1)).toBeTruthy());
		test('number not-equal', () => expect(isEqual(1, 0)).toBeFalsy());
		test('string equal', () => expect(isEqual('abc', 'abc')).toBeTruthy());
		test('string not-equal', () => expect(isEqual('abc', '')).toBeFalsy());
		test('array equal', () => expect(isEqual([true, 1, 'a'], [true, 1, 'a'])).toBeTruthy());
		test('array not-equal', () => expect(isEqual([true, 1, 'a'], [1])).toBeFalsy());
		test('object equal', () => expect(isEqual({a: 1, b: 2}, {a: 1, b: 2})).toBeTruthy());
		test('object not-equal', () => expect(isEqual({a: 1, b: 2}, {a: 1})).toBeFalsy());
		test('complex', () => expect(isEqual(TEST_OBJECT, TEST_OBJECT)).toBeTruthy());
	});
});
