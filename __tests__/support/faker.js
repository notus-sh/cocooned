/* global jest */

const { faker } = require('@faker-js/faker/locale/en')

faker.seed(jest.getSeed())

module.exports = faker
