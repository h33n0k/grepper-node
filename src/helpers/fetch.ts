import { Effect, Schema } from 'effect'
import { RequestError, ResponseError } from '../handlers/api'
import { ValidationError } from '../handlers/schema'

/**
 * A utility function to fetch data from a given URL, validate the response using a schema,
 * and handle potential errors during the request or validation process.
 *
 * @template S - The type that the response data should conform to, as defined by the schema.
 *
 * @param url - The URL to fetch data from. Must be a fully constructed URL object.
 * @param schema - A `Schema.Schema` object defining the expected shape of the response data.
 * @param options - An object specifying the fetch request options (e.g., HTTP method, headers, body).
 *
 * @returns An `Effect` that yields the validated response data of type `S` if successful.
 *
 * @throws RequestError - If there is an issue with the network request, such as a timeout or DNS error.
 * @throws ResponseError - If the HTTP response status is not OK (status codes 4xx or 5xx).
 * @throws ValidationError - If the response data does not match the provided schema.
 *
 * @example
 * import { Schema } from 'effect';
 *
 * const userSchema = Schema.struct({
 *   id: Schema.number,
 *   name: Schema.string
 * });
 *
 * const fetchUser = fetchAndValidate(new URL('https://api.example.com/user/1'), userSchema, {
 *   method: 'GET',
 *   headers: { Authorization: 'Bearer token' }
 * });
 *
 * fetchUser.pipe(Effect.runPromise).then((user) => {
 *   console.log(user); // { id: 1, name: "John Doe" }
 * }).catch((error) => {
 *   console.error(error); // Handles RequestError, ResponseError, or ValidationError
 * });
 *
 * @example
 * // Handling errors explicitly:
 * fetchUser.pipe(
 *   Effect.catchAll((error) => Effect.succeed(`Error occurred: ${error.message}`)),
 *   Effect.runPromise
 * ).then(console.log);
 */
export default <S>(url: URL, schema: Schema.Schema<S>, options: RequestInit) =>
	Effect.gen(function* () {
		// try to fetch the data from the provided URL
		const response = yield* Effect.tryPromise({
			try: () => fetch(url.toString(), options),
			catch: (error) => new RequestError(error)
		})

		// Check if the response status indicates success
		if (!response.ok) return yield* Effect.fail(new ResponseError(response))

		// Decode and validate the JSON using the provided schema
		const json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (error) => new RequestError(error)
		})

		return yield* Schema.decodeUnknown(schema, {
			onExcessProperty: 'ignore'
		})(json).pipe(Effect.catchAll(() => Effect.fail(new ValidationError())))
	})
