export function whereBuilder<T>(query: T, where: object): T {
	return !where ? query :
		Object.entries(where).reduce((qb, [key, val]) => (<any>query).where(key, '=', val), query);
}
