import { RequestError, ResponseError } from '../api'

describe('RequestError', () => {
	it('should initialize with the correct error message', () => {
		for (const unit of [
			['ECONNREFUSED', 'Connection refused.', 'TypeError'],
			['ENOTFOUND', 'Server not found.', 'TypeError'],
			['ETIMEDOUT', 'Request timed out.', 'TypeError'],
			['AbortError', 'Request timed out.', 'DOMException'],
			['Unexpected', 'Unexpected Error.', 'Error']
		] as string[][]) {
			let mockedError: unknown
			switch (unit[2]) {
				case 'Error':
					mockedError = new Error(unit[0])
					break
				case 'DOMException':
					mockedError = new DOMException('exception message', unit[0])
					break
				case 'TypeError':
					mockedError = new TypeError('Network Error', {
						cause: { code: unit[0] }
					})
					break
			}

			if (!mockedError) {
				throw new Error('Expected the mocked error to be defined.')
			}

			const error = new RequestError(mockedError)
			expect(error.message).toBe(unit[1])
		}
	})
})

describe('ResponseError', () => {
	it('should initialize with the correct error message', () => {
		for (const unit of [
			[401, 'Invalid API KEY.'],
			[429, 'Too many requests.'],
			[500, 'Internal Grepper error.'],
			[503, 'Temporarily offline, try again later.'],
			[599, 'An unknown error occurred. Please try again.']
		] as string[][]) {
			const mockedResonse = new Response(null, {
				status: unit[0] as unknown as number
			})

			const error = new ResponseError(mockedResonse)
			expect(error.message).toBe(unit[1])
		}
	})
})
