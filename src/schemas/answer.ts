import { Schema } from 'effect'

/**
 * Schema representing an individual answer object.
 *
 * Fields:
 * - `id` (number): Unique identifier for the answer.
 * - `content` (string): The main content or body of the answer.
 * - `author_name` (string): Name of the user who authored the answer.
 * - `title` (string): Title or brief description of the answer.
 * - `upvotes` (number): Count of upvotes the answer has received.
 * - `downvotes` (number): Count of downvotes the answer has received.
 * - `object` (string): Specifies the type of object, e.g., "answer".
 */
export const answer = Schema.Struct({
	id: Schema.Number,
	content: Schema.String,
	author_name: Schema.String,
	title: Schema.String,
	upvotes: Schema.Number,
	downvotes: Schema.Number,
	object: Schema.String
})

/**
 * Schema representing a list of answers.
 *
 * Fields:
 * - `object` (string): Specifies the type of object, e.g., "list".
 * - `data` (array): An array containing individual `answer` objects.
 */
export const list = Schema.Struct({
	object: Schema.String,
	data: Schema.Array(answer)
})

/**
 * Schema representing the response to an update operation.
 *
 * Fields:
 * - `id` (number): Unique identifier for the updated answer.
 * - `success` (string): A stringified boolean value indicating whether the update was successful.
 *   Example: `"true"` or `"false"`.
 */
export const update = Schema.Struct({
	id: Schema.Number,
	success: Schema.Literal('true', 'false')
})

export type Update = Schema.Schema.Type<typeof update>
export type Answer = Schema.Schema.Type<typeof answer>
export type List = Schema.Schema.Type<typeof list>

/**
 * Interface representing the query parameters for search operations.
 *
 * Fields:
 * - `query` (string): The search term or keyword to look for.
 * - `similarity` (number): The minimum similarity score required for results (e.g., 60 for 60%).
 */
export interface Query {
	query: string
	similarity: number
}

/**
 * Interface representing the body of a request to update an answer.
 *
 * Fields:
 * - `answer[content]` (string): The new content to update the answer with.
 */
export interface Body {
	'answer[content]': string
}
