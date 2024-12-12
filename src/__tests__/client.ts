import { Effect } from 'effect'
import { faker } from '@faker-js/faker/.'
import { Client } from '..'
import * as fetchAndValidate from '../helpers/fetch'
import { mockedList } from '../helpers/__mocked__/fetch'
import { list } from '../schemas/answer'

const getClient = () =>
	new Client({ api_key: 'test-api-key', base_url: faker.internet.url() })

describe('Search method', () => {
	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should returns fetched answers', async () => {
		const client = getClient()
		const mockedResponse = mockedList()
		const mockedFetch = jest
			.spyOn(fetchAndValidate, 'default')
			.mockImplementation(() => Effect.succeed(mockedResponse))
		const mockedQuery = faker.lorem.sentence()
		const mockedSimilarity = 40
		const result = await client.search(mockedQuery, mockedSimilarity)
		expect(mockedFetch).toHaveBeenCalledWith(
			expect.any(URL),
			list,
			expect.objectContaining({
				method: 'GET'
			})
		)

		expect(result).toStrictEqual(mockedResponse.data)
	})
})
