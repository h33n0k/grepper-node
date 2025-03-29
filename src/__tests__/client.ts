import { Effect } from 'effect'
import { faker } from '@faker-js/faker/.'
import { ResponseError, RequestError } from '../handlers/api'
import { ValidationError } from '../handlers/schema'
import {
	Client,
	RequestError as ExportedRequestError,
	ResponseError as ExportedResponseError,
	ValidationError as ExportedValidationError
} from '..'
import * as fetchAndValidate from '../helpers/fetch'
import { mockedList, mockedAnswer } from '../helpers/__mocked__/fetch'
import { answer, list, update } from '../schemas/answer'

describe('Client instance', () => {
	let client: Client

	it('should exports tag errors', () => {
		expect(ExportedRequestError).toBeDefined()
		expect(ExportedRequestError).toEqual(RequestError)

		expect(ExportedResponseError).toBeDefined()
		expect(ExportedResponseError).toEqual(ResponseError)

		expect(ExportedValidationError).toBeDefined()
		expect(ExportedValidationError).toEqual(ValidationError)
	})

	beforeEach(() => {
		client = new Client({
			api_key: 'mocked_api_key'
		})
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	describe('`search` method', () => {
		it('should return fetched answers', async () => {
			// Mocks
			const query = faker.lorem.sentence()
			const similarity = faker.number.int({ min: 40, max: 100 })
			const mockedResponse = mockedList()

			// Spies
			const fetchSpy = jest
				.spyOn(fetchAndValidate, 'default')
				.mockImplementation(() => Effect.succeed(mockedResponse))

			const response = await client.search(query, similarity)

			// Assertions
			expect(fetchSpy).toHaveBeenCalledTimes(1)
			expect(fetchSpy).toHaveBeenCalledWith(
				expect.any(URL),
				list,
				expect.objectContaining({
					method: 'GET',
					headers: expect.any(Headers),
					body: null
				})
			)

			expect(response).toEqual(mockedResponse.data)
		})
	})

	describe('`answer` method', () => {
		it('should return answer if found', async () => {
			// Mocks
			const id = faker.number.int()
			const mockedResponse = mockedAnswer()

			// Spies
			const fetchSpy = jest
				.spyOn(fetchAndValidate, 'default')
				.mockImplementation(() => Effect.succeed(mockedResponse))

			const response = await client.answer(id)

			// Assertions
			expect(fetchSpy).toHaveBeenCalledTimes(1)
			expect(fetchSpy).toHaveBeenCalledWith(
				expect.any(URL),
				answer,
				expect.objectContaining({
					method: 'GET',
					headers: expect.any(Headers),
					body: null
				})
			)

			expect(response).toEqual(mockedResponse)
		})
	})

	describe('`update` method', () => {
		it('should return the updated status', async () => {
			// Mocks
			const id = faker.number.int()
			const content = faker.lorem.sentence()
			const mockedResponse = { id, success: 'true' }

			// Spies
			const fetchSpy = jest
				.spyOn(fetchAndValidate, 'default')
				.mockImplementation(() => Effect.succeed(mockedResponse))

			const response = await client.update(id, content)

			// Assertions
			expect(fetchSpy).toHaveBeenCalledTimes(1)
			expect(fetchSpy).toHaveBeenCalledWith(
				expect.any(URL),
				update,
				expect.objectContaining({
					method: 'POST',
					headers: expect.any(Headers)
				})
			)

			expect(response).toEqual({
				...mockedResponse,
				success: true
			})
		})
	})
})
