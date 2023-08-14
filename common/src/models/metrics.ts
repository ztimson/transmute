export type Metrics = {
	resolution: {[key: string]: number},
	container: {[key: string]: number},
	videoCodec: {[key: string]: number},
	audioCodec: {[key: string]: number},
	health: {
		healthy: number,
		unhealthy: number,
		unknown: number
	},
	audioLang: {[key: string]: number},
	subLang: {[key: string]: number},
	size: number,
	videos: number
}
