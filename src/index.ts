import { Effect, Schema } from 'effect'
import fetchAndValidate from './helpers/fetch'
import * as AnswerSchema from './schemas/answer'
import { Endpoints, Endpoint, ClientOptions } from './types'

export * from './types'
export type { Answer } from './schemas/answer'
export { RequestError, ResponseError } from './handlers/api'
export { ValidationError } from './handlers/schema'

/**
 * Client class for interacting with the Grepper API.
 */
export class Client {
	private readonly api_key: string
	private readonly headers: Headers
	public readonly base_url: string
	private readonly endpoints: Endpoints

	/**
	 * Constructs a new instance of the Client.
	 * @param options - The options for configuring the client.
	 * @param options.api_key - The API key for authentication (required).
	 * @param options.headers - Optional custom headers to include in requests.
	 * @param options.base_url - Optional custom base URL for the API. Defaults to 'https://api.grepper.com/v1'.
	 */
	constructor(options: ClientOptions) {
		this.api_key = options.api_key
		this.headers = new Headers({
			...{
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			...options.headers
		})
		this.headers.set('Authorization', 'Basic ' + btoa(`${this.api_key}:`))
		this.base_url =
			options.base_url?.replace(/\/$/, '') ?? 'https://api.grepper.com/v1'
		this.endpoints = {
			base: `${this.base_url}/`,
			search: `${this.base_url}/answers/search`,
			answer: `${this.base_url}/answers`
		}
	}

	/**
	 * Constructs a URL for a given endpoint with optional query parameters and path parameters.
	 *
	 * @param endpoint - The endpoint key (e.g., 'search', 'answer').
	 * @param param - Optional path parameter (e.g., answer ID).
	 * @param query - Optional query parameters.
	 *
	 * @returns The constructed URL.
	 *
	 * @example
	 * const url = client.url('search', null, { query: 'TypeScript' });
	 * console.log(url); // 'https://api.grepper.com/v1/answers/search?query=TypeScript'
	 */
	private get url() {
		return <Q>(endpoint: Endpoint, param?: number, query?: Q) => {
			const url = new URL(this.endpoints[endpoint])
			if (param) url.pathname += `/${param}`
			if (query) {
				Object.entries(query).forEach(([key, value]) =>
					url.searchParams.append(key, value as string)
				)
			}

			return url
		}
	}

	/**
	 * Sends a request to the API and validates the response using the provided schema.
	 *
	 * @param options - The request options.
	 * @param options.endpoint - The endpoint to call (e.g., 'search', 'answer').
	 * @param options.schema - The schema to validate the response.
	 * @param options.query - Optional query parameters.
	 * @param options.param - Optional path parameter (e.g., answer ID).
	 * @param options.body - Optional request body for POST requests.
	 *
	 * @returns An effect that resolves to the validated API response.
	 *
	 * @example
	 * const response = this.query<AnswerSchema.List>({
	 *   endpoint: 'search',
	 *   query: { query: 'JavaScript' },
	 *   schema: AnswerSchema.list
	 * })
	 * console.log(response) // Effect.Effect<S, ..., never>
	 */
	private query<S, Q = never, B = never>(options: {
		endpoint: Endpoint
		schema: Schema.Schema<S>
		query?: Q
		param?: number
		body?: B
	}) {
		return fetchAndValidate<S>(
			this.url<Q>(options.endpoint, options.param, options.query),
			options.schema,
			{
				method: options.body ? 'POST' : 'GET',
				headers: this.headers,
				body: options.body ? new URLSearchParams(options.body) : null
			}
		)
	}

	/**
	 * Global error handler to catch all errors and fail the effect.
	 *
	 * @returns An effect that fails with the provided error.
	 */
	private get handler() {
		return Effect.catchAll((error: unknown) => {
			return Effect.fail(error)
		})
	}

	/**
	 * Searches for answers based on a query string and an optional similarity score.
	 *
	 * @param query - The search query (e.g., 'JavaScript async').
	 * @param similarity - Optional similarity score (default is 60). A higher value means more strict matching.
	 *
	 * @returns A promise that resolves to an array of matching answers.
	 *
	 * @example
	 * const results = await client.search('async await', 80);
	 */
	search(query: string, similarity = 60): Promise<AnswerSchema.Answer[]> {
		return this.query<AnswerSchema.List, AnswerSchema.Query>({
			endpoint: 'search',
			query: { query, similarity },
			schema: AnswerSchema.list
		}).pipe(
			Effect.flatMap((response) => Effect.succeed([...response.data])),
			this.handler,
			Effect.runPromise
		)
	}

	/**
	 * Retrieves an answer by its ID.
	 *
	 * Note: This endpoint is currently not accessible from the Grepper API and is still in development.
	 * The function implementation is based on their official documentation and may require updates
	 * once the endpoint becomes available.
	 * @see https://www.grepper.com/api-docs/index.php#retreive-an-answer
	 *
	 * @param id - The ID of the answer to retrieve.
	 *
	 * @returns A promise that resolves to the answer object.
	 *
	 * @example
	 * const answer = await client.answer(1);
	 * console.log(answer); // { ...AnswerSchema.Answer }
	 */
	answer(id: number): Promise<AnswerSchema.Answer> {
		return this.query<AnswerSchema.Answer>({
			endpoint: 'answer',
			param: id,
			schema: AnswerSchema.answer
		}).pipe(this.handler, Effect.runPromise)
	}

	/**
	 * Updates the content of an existing answer.
	 *
	 * Note: This endpoint is currently not accessible from the Grepper API and is still in development.
	 * The function implementation is based on their official documentation and may require updates
	 * once the endpoint becomes available.
	 * @see https://www.grepper.com/api-docs/index.php#update-a-specific-answer
	 *
	 * @param id - The ID of the answer to update.
	 * @param content - The new content for the answer.
	 *
	 * @returns A promise that resolves to the updated status of the answer (including the success flag).
	 *
	 * @example
	 * const updatedStatus = await client.update(1, 'New answer content');
	 * console.log(updatedStatus); // { id: 1, success: true }
	 */
	update(
		id: number,
		content: AnswerSchema.Body['answer[content]']
	): Promise<Omit<AnswerSchema.Update, 'success'> & { success: boolean }> {
		return this.query<AnswerSchema.Update, never, AnswerSchema.Body>({
			endpoint: 'answer',
			schema: AnswerSchema.update,
			param: id,
			body: { 'answer[content]': content }
		}).pipe(
			Effect.flatMap(({ id, success }) =>
				Effect.succeed({ id, success: success === 'true' ? true : false })
			),
			this.handler,
			Effect.runPromise
		)
	}
}
