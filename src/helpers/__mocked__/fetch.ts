import { faker } from '@faker-js/faker'
import { List, Answer } from '../../schemas/answer'

export const mockedAnswer = () =>
	({
		object: 'answer',
		id: faker.number.int({ max: 7000 }),
		title: faker.lorem.sentence(),
		author_name: faker.internet.username(),
		content: faker.lorem.paragraph(),
		upvotes: faker.number.int(100),
		downvotes: faker.number.int(100)
	}) as Answer

export const mockedList = () =>
	({
		object: 'list',
		data: new Array(faker.number.int({ max: 5, min: 3 }))
			.fill(null)
			.map(() => mockedAnswer())
	}) as List
