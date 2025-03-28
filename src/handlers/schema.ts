import { Data } from 'effect'

export class ValidationError extends Data.TaggedError('SchemaValidation') {
	public readonly title = 'Validation Error'
	public readonly message: string
	public code = 'SCHEMA'
	constructor() {
		super()
		this.message = 'Response does not match expected schema.'
	}
}
