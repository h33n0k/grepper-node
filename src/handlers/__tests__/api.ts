import { RequestError, ResponseError } from '../api'

describe('`handlers/api`:', () => {
	describe('RequestError:', () => {
		const tests: {
			description: string
			error: {
				code?: string
				type:
					| 'TypeError'
					| 'DOMException'
					| 'Error'
					| 'SyntaxError'
					| 'Undefined'
				expectedCode:
					| 'UNEXPECTED'
					| 'REFUSED'
					| 'NOTFOUND'
					| 'TIMEDOUT'
					| 'ABORTED'
					| 'NOTJSON'
			}
		}[] = [
			{
				description: 'should handle refused connection error',
				error: {
					code: 'ECONNREFUSED',
					type: 'TypeError',
					expectedCode: 'REFUSED'
				}
			},
			{
				description: 'should handle unreachable server error',
				error: {
					code: 'ENOTFOUND',
					type: 'TypeError',
					expectedCode: 'NOTFOUND'
				}
			},
			{
				description: 'should handle timed out request error',
				error: {
					code: 'ETIMEDOUT',
					type: 'TypeError',
					expectedCode: 'TIMEDOUT'
				}
			},
			{
				description: 'should handle aborted request',
				error: {
					code: 'AbortError',
					type: 'DOMException',
					expectedCode: 'ABORTED'
				}
			},
			{
				description: 'should handle invalid JSON response',
				error: {
					type: 'SyntaxError',
					expectedCode: 'NOTJSON'
				}
			},
			{
				description: 'should handle unknown error',
				error: {
					code: 'UNEXPECTED',
					type: 'Error',
					expectedCode: 'UNEXPECTED'
				}
			},
			{
				description: 'should handle non object error',
				error: {
					code: 'UNEXPECTED',
					type: 'Undefined',
					expectedCode: 'UNEXPECTED'
				}
			}
		]

		describe.each(tests)('Test suite:', ({ description, error }) => {
			it(description, () => {
				let mockError: TypeError | DOMException | Error | 'non-object'
				switch (error.type) {
					case 'TypeError':
						mockError = new TypeError('mocked error message', {
							cause: { code: error.code }
						})
						break
					case 'DOMException':
						mockError = new DOMException('mocked error message', error.code)
						break
					case 'SyntaxError':
						mockError = new SyntaxError('mocked error message')
						break
					case 'Undefined':
						mockError = 'non-object'
						break
					case 'Error':
					default:
						mockError = new Error('mocked error message', {
							cause: { code: error.code }
						})
						break
				}

				if (!mockError)
					throw new Error('Expected the mock error to be defined.')

				const result = new RequestError(mockError)
				expect(result).toBeDefined()
				expect(result).toBeInstanceOf(RequestError)
				expect(result.title).toEqual('Request Error')
				expect(result.code).toEqual(error.expectedCode)
			})
		})
	})

	describe('ResponseError:', () => {
		const tests: {
			description: string
			status: number
			expectedCode:
				| 'UNEXPECTED'
				| 'UNAUTHORIZED'
				| 'RATE_LIMIT'
				| 'INTERNAL'
				| 'UNAVAILABLE'
		}[] = [
			{
				description: 'should handle unauthorized error',
				status: 401,
				expectedCode: 'UNAUTHORIZED'
			},
			{
				description: 'should handle rate limited request',
				status: 429,
				expectedCode: 'RATE_LIMIT'
			},
			{
				description: 'should handle server internal error',
				status: 500,
				expectedCode: 'INTERNAL'
			},
			{
				description: 'should handle unavailable server error',
				status: 503,
				expectedCode: 'UNAVAILABLE'
			},
			{
				description: 'should handle unexpected error',
				status: 599,
				expectedCode: 'UNEXPECTED'
			}
		]

		describe.each(tests)(
			'Test suite:',
			({ description, status, expectedCode }) => {
				it(description, () => {
					const mockError = new Response(null, { status })

					const result = new ResponseError(mockError)

					expect(result).toBeDefined()
					expect(result).toBeInstanceOf(ResponseError)
					expect(result.title).toEqual('Response Error')
					expect(result.code).toEqual(expectedCode)
				})
			}
		)
	})
})
