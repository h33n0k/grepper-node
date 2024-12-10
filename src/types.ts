export interface Endpoints {
	readonly base: string
	readonly search: string
	readonly answer: string
}

export type Endpoint = keyof Omit<Endpoints, 'base'>

export interface ClientOptions {
	api_key: string
	headers?: Record<string, string>
	base_url?: string
}
