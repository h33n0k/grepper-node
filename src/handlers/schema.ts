import { Data } from 'effect'

export class ValidationError extends Data.TaggedError('SchemaValidation') {
	public readonly title = 'Validation Error'
	public readonly message: string
	constructor() {
		super()
		this.message = 'Could not validate schema.'
	}
}
