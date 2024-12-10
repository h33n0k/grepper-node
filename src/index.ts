import { Effect, Schema } from 'effect'
import fetchAndValidate from './helpers/fetch'
import { ValidationError } from './handlers/schema'
import * as AnswerSchema from './schemas/answer'
import { Endpoints, Endpoint, ClientOptions } from './types'

export default class Client {
	private readonly api_key: string
	private readonly headers: Headers
	public readonly base_url: string
	private readonly endpoints: Endpoints
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

	private get handler() {
		return Effect.catchAll((error: unknown) => {
			return Effect.fail(error)
		})
	}

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

	answer(id: number): Promise<AnswerSchema.Answer> {
		return this.query<AnswerSchema.Answer>({
			endpoint: 'answer',
			param: id,
			schema: AnswerSchema.answer
		}).pipe(this.handler, Effect.runPromise)
	}

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
				Effect.try({
					try: () => ({
						id,
						success:
							typeof success === 'string'
								? (JSON.parse(success) as boolean)
								: false
					}),
					catch: () => new ValidationError()
				}).pipe(Effect.andThen((status) => Effect.succeed(status)))
			),
			this.handler,
			Effect.runPromise
		)
	}
}
