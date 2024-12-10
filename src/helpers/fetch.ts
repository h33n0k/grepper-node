import { Effect, Schema } from 'effect'
import { RequestError, ResponseError } from '../handlers/api'
import { ValidationError } from '../handlers/schema'

export default <S>(url: URL, schema: Schema.Schema<S>, options: RequestInit) =>
	Effect.gen(function* () {
		const response = yield* Effect.tryPromise({
			try: () => fetch(url.toString(), options),
			catch: (error) => new RequestError(error)
		})

		if (!response.ok) return yield* Effect.fail(new ResponseError(response))

		const json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (error) => new RequestError(error)
		})

		return yield* Schema.decodeUnknown(schema, {
			onExcessProperty: 'ignore'
		})(json).pipe(Effect.catchAll(() => Effect.fail(new ValidationError())))
	})
