import { Data } from 'effect'

export class RequestError extends Data.TaggedError('Request') {
	public readonly title = 'Request Error'
	public readonly error: unknown
	public readonly message: string
	public code:
		| 'UNEXPECTED'
		| 'REFUSED'
		| 'NOTFOUND'
		| 'TIMEDOUT'
		| 'ABORTED'
		| 'NOTJSON'
	constructor(error: unknown) {
		super()
		this.code = 'UNEXPECTED'
		this.error = error
		this.message = this.getMessage()
	}

	private getMessage() {
		const defaultMessage = 'Unexpected error occured.'

		if (!this.error || typeof this.error !== 'object') return defaultMessage

		if (this.error instanceof SyntaxError) {
			this.code = 'NOTJSON'
			return 'Failed to parse JSON response.'
		}

		if (this.error instanceof TypeError && 'cause' in this.error) {
			const cause = this.error.cause as { code: string }
			switch (cause.code) {
				case 'ECONNREFUSED':
					this.code = 'REFUSED'
					return 'Connection refused.'
				case 'ENOTFOUND':
					this.code = 'NOTFOUND'
					return 'Server not found.'
				case 'ETIMEDOUT':
					this.code = 'TIMEDOUT'
					return 'Request timed out.'
			}
		}

		if ('name' in this.error && this.error.name === 'AbortError') {
			this.code = 'ABORTED'
			return 'Request timed out.'
		}

		return defaultMessage
	}
}

export class ResponseError extends Data.TaggedError('Response') {
	public readonly title = 'Response Error'
	public readonly message: string
	public readonly status: number
	public code:
		| 'UNEXPECTED'
		| 'UNAUTHORIZED'
		| 'RATE_LIMIT'
		| 'INTERNAL'
		| 'UNAVAILABLE'
	constructor(response: Response) {
		super()
		this.status = response.status
		this.code = 'UNEXPECTED'
		this.message = this.getMessage()
	}

	private getMessage() {
		switch (this.status) {
			case 401:
				this.code = 'UNAUTHORIZED'
				return 'Invalid API KEY.'
			case 429:
				this.code = 'RATE_LIMIT'
				return 'Too many requests.'
			case 500:
				this.code = 'INTERNAL'
				return 'Internal Grepper error.'
			case 503:
				this.code = 'UNAVAILABLE'
				return 'Temporarily offline, try again later.'
			default:
				return 'An unknown error occurred. Please try again.'
		}
	}
}
