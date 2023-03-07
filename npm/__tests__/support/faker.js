import { jest } from '@jest/globals'
import { faker } from '@faker-js/faker/locale/en'

faker.seed(jest.getSeed())

export { faker }
