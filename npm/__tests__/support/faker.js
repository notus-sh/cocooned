import { jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

faker.seed(jest.getSeed())

export { faker }
