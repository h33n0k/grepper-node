import { Effect } from 'effect'
import fetchAndValidate from '../fetch'
import { list, List } from '../../schemas/answer'
import { RequestError, ResponseError } from '../../handlers/api'
import { ValidationError } from '../../handlers/schema'
import { mockedList } from '../__mocked__/fetch'

describe('fetchAndValidate', () => {
	const mockedUrl = new URL('https://endpoint.com')
	const callTests = (mockedFetch: jest.SpyInstance, options: RequestInit) => {
		expect(mockedFetch).toHaveBeenCalledTimes(1)
		expect(mockedFetch).toHaveBeenCalledWith(mockedUrl.toString(), options)
	}

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should return valid data when valid response', async () => {
		const mockedResponse = mockedList()
		const options: RequestInit = { method: 'GET' }
		const mockedFetch = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify(mockedResponse), { status: 200 })
			)
		await fetchAndValidate<List>(mockedUrl, list, options).pipe(
			Effect.match({
				onFailure: (error) => {
					console.log(error)
					throw new Error('Expected the effect to success.')
				},
				onSuccess: (response) => {
					expect(response).toBeDefined()
					expect(response).toMatchObject(mockedResponse)
				}
			}),
			Effect.runPromise
		)

		callTests(mockedFetch, options)
	})

	it('should throw a RequestError on fetch failure', async () => {
		const options: RequestInit = { method: 'GET' }
		const mockedFetch = jest
			.spyOn(global, 'fetch')
			.mockRejectedValue(new Error('Network Error'))
		await fetchAndValidate<List>(mockedUrl, list, options).pipe(
			Effect.match({
				onSuccess: () => {
					throw new Error('Expected the effect to fail.')
				},
				onFailure: (error) => {
					expect(error).toBeDefined()
					expect(error).toBeInstanceOf(RequestError)
				}
			}),
			Effect.runPromise
		)

		callTests(mockedFetch, options)
	})

	it('should throw a ResponseError when response status is not successful', async () => {
		const options: RequestInit = { method: 'GET' }
		const mockedFetch = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(null, { status: 500 }))
		await fetchAndValidate<List>(mockedUrl, list, options).pipe(
			Effect.match({
				onSuccess: () => {
					throw new Error('Expected the effect to fail.')
				},
				onFailure: (error) => {
					expect(error).toBeDefined()
					expect(error).toBeInstanceOf(ResponseError)
				}
			}),
			Effect.runPromise
		)

		callTests(mockedFetch, options)
	})

	it('should throw a ValidationError when response does not match the provided schema', async () => {
		const options: RequestInit = { method: 'GET' }
		const mockedFetch = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ invalid: true }), { status: 200 })
			)
		await fetchAndValidate<List>(mockedUrl, list, options).pipe(
			Effect.match({
				onSuccess: () => {
					throw new Error('Expected the effect to fail.')
				},
				onFailure: (error) => {
					expect(error).toBeDefined()
					expect(error).toBeInstanceOf(ValidationError)
				}
			}),
			Effect.runPromise
		)

		callTests(mockedFetch, options)
	})
})
