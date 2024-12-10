import { Schema } from 'effect'

export const answer = Schema.Struct({
	id: Schema.Number,
	content: Schema.String,
	author_name: Schema.String,
	title: Schema.String,
	upvotes: Schema.Number,
	downvotes: Schema.Number,
	object: Schema.String
})

export const list = Schema.Struct({
	object: Schema.String,
	data: Schema.Array(answer)
})

export const update = Schema.Struct({
	id: Schema.Number,
	success: Schema.String
})

export type Update = Schema.Schema.Type<typeof update>
export type Answer = Schema.Schema.Type<typeof answer>
export type List = Schema.Schema.Type<typeof list>

export interface Query {
	query: string
	similarity: number
}

export interface Body {
	'answer[content]': string
}
