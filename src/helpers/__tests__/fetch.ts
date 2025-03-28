import { Effect, Schema } from 'effect'
import fetchAndValidate from '../fetch'
import * as AnswerSchema from '../../schemas/answer'
import { RequestError, ResponseError } from '../../handlers/api'

import { mockedList } from '../__mocked__/fetch'
import { ValidationError } from '../../handlers/schema'

describe('`helpers/fetch`:', () => {
	describe('FetchAndValidate:', () => {
		afterEach(() => {
			jest.resetAllMocks()
		})

		interface Mocks {
			fetch: jest.SpyInstance
			json: jest.Mock
			decodeUnknown: jest.SpyInstance
		}

		interface Call {
			spy: keyof Mocks
			times: number
			args?: (keyof Pick<Test, 'options' | 'schema' | 'url'> | object)[][]
		}

		interface Test {
			description: string
			url: URL
			schema: typeof AnswerSchema.list
			options: RequestInit
			mocks: () => Mocks
			calls: Call[]
			expectSuccess: boolean
			expectError?: {
				type: any
				code: string
			}
		}

		const tests: Test[] = [
			{
				description: 'should fetch query and validate response',
				url: new URL('http://mockedurl/answers/search'),
				options: {
					method: 'GET'
				},
				mocks: () => {
					const mockJson = jest.fn().mockResolvedValue(mockedList())
					return {
						json: mockJson,
						fetch: jest.spyOn(global, 'fetch').mockResolvedValue({
							ok: true,
							json: mockJson
						} as unknown as Response),
						decodeUnknown: jest.spyOn(Schema, 'decodeUnknown')
					}
				},
				calls: [
					{
						spy: 'fetch',
						times: 1,
						args: [['url', 'options']]
					},
					{
						spy: 'json',
						times: 1
					},
					{
						spy: 'decodeUnknown',
						times: 1,
						args: [['schema', { onExcessProperty: 'ignore' }]]
					}
				],
				schema: AnswerSchema.list,
				expectSuccess: true
			},
			{
				description: 'should throw a Request Error if fetch fails',
				url: new URL('http://mockedurl/answers/search'),
				options: {
					method: 'GET'
				},
				mocks: () => {
					return {
						json: jest.fn(),
						fetch: jest.spyOn(global, 'fetch').mockRejectedValue(
							new TypeError('mocked error message', {
								cause: {
									code: 'ECONNREFUSED'
								}
							})
						),
						decodeUnknown: jest.spyOn(Schema, 'decodeUnknown')
					}
				},
				calls: [
					{
						spy: 'fetch',
						times: 1,
						args: [['url', 'options']]
					},
					{
						spy: 'json',
						times: 0
					},
					{
						spy: 'decodeUnknown',
						times: 0
					}
				],
				schema: AnswerSchema.list,
				expectSuccess: false,
				expectError: {
					type: RequestError,
					code: 'REFUSED'
				}
			},
			{
				description: 'should throw a Response Error if response is not ok',
				url: new URL('http://mockedurl/answers/search'),
				options: {
					method: 'GET'
				},
				mocks: () => {
					const mockJson = jest.fn().mockResolvedValue(mockedList())
					return {
						json: mockJson,
						fetch: jest.spyOn(global, 'fetch').mockResolvedValue({
							ok: false,
							status: 401,
							json: mockJson
						} as unknown as Response),
						decodeUnknown: jest.spyOn(Schema, 'decodeUnknown')
					}
				},
				calls: [
					{
						spy: 'fetch',
						times: 1,
						args: [['url', 'options']]
					},
					{
						spy: 'json',
						times: 0
					},
					{
						spy: 'decodeUnknown',
						times: 0
					}
				],
				schema: AnswerSchema.list,
				expectSuccess: false,
				expectError: {
					type: ResponseError,
					code: 'UNAUTHORIZED'
				}
			},
			{
				description: 'should throw a Request Error if response parse fails',
				url: new URL('http://mockedurl/answers/search'),
				options: {
					method: 'GET'
				},
				mocks: () => {
					const mockJson = jest
						.fn()
						.mockRejectedValue(new SyntaxError('mocked error message'))
					return {
						json: mockJson,
						fetch: jest.spyOn(global, 'fetch').mockResolvedValue({
							ok: true,
							json: mockJson
						} as unknown as Response),
						decodeUnknown: jest.spyOn(Schema, 'decodeUnknown')
					}
				},
				calls: [
					{
						spy: 'fetch',
						times: 1,
						args: [['url', 'options']]
					},
					{
						spy: 'json',
						times: 1
					},
					{
						spy: 'decodeUnknown',
						times: 0
					}
				],
				schema: AnswerSchema.list,
				expectSuccess: false,
				expectError: {
					type: RequestError,
					code: 'NOTJSON'
				}
			},
			{
				description:
					'should throw a Validation Error if response does not match schema',
				url: new URL('http://mockedurl/answers/search'),
				options: {
					method: 'GET'
				},
				mocks: () => {
					const mockJson = jest
						.fn()
						.mockResolvedValue({ mocked: 'mocked response' })
					return {
						json: mockJson,
						fetch: jest.spyOn(global, 'fetch').mockResolvedValue({
							ok: true,
							json: mockJson
						} as unknown as Response),
						decodeUnknown: jest.spyOn(Schema, 'decodeUnknown')
					}
				},
				calls: [
					{
						spy: 'fetch',
						times: 1,
						args: [['url', 'options']]
					},
					{
						spy: 'json',
						times: 1
					},
					{
						spy: 'decodeUnknown',
						times: 1,
						args: [['schema', { onExcessProperty: 'ignore' }]]
					}
				],
				schema: AnswerSchema.list,
				expectSuccess: false,
				expectError: {
					type: ValidationError,
					code: 'SCHEMA'
				}
			}
		]

		describe.each(tests)(
			'Test suite:',
			({
				description,
				url,
				mocks,
				schema,
				options,
				expectSuccess,
				expectError,
				calls
			}) => {
				it(description, async () => {
					// Setup mocks
					const spies = mocks()

					await fetchAndValidate<Schema.Schema.Type<typeof schema>>(
						url,
						schema,
						options
					).pipe(
						Effect.match({
							onSuccess: (result) => {
								if (!expectSuccess)
									throw new Error('expected the effect to fail.')

								expect(result).toBeDefined()
							},
							onFailure: (error) => {
								if (expectSuccess) throw error
								if (!expectError)
									throw new Error('expected the test error to be defined')

								expect(error).toBeDefined()
								expect(error).toBeInstanceOf(expectError.type)
								expect(error.code).toEqual(expectError.code)
							}
						}),
						Effect.runPromise
					)

					for (const { spy, times, args } of calls) {
						if (times > 0) {
							const spyInstance = spies[spy as keyof typeof spies]
							expect(spyInstance).toHaveBeenCalledTimes(times)
							if (args && args.length > 0) {
								for (let i = 0; i < times; i++) {
									const v = args[i].map((arg) => {
										switch (arg) {
											case 'url':
												return url.toString()
											case 'options':
												return options
											case 'schema':
												return schema
											default:
												return arg
										}
									})

									for (let j = 0; j < spyInstance.mock.calls.length; j++) {
										expect(spyInstance.mock.calls[i][j]).toEqual(v[j])
									}
								}
							}
						}
					}
				})
			}
		)
	})
})
