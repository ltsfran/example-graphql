import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import axios from 'axios'
import { GraphQLError } from 'graphql'

const typeDefs = `#graphql
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String
    website: String
    detail: String!
    address: Address!
  }

  type Query {
    userCount: Int!
    users(limit: Int!): [User]!
    allUsers(phone: YesNo): [User]!
    findUser(name: String!): User
  }

  type Mutation {
    addUser(
      name: String!
      username: String!
      email: String!
      street: String!
    ): User
    editNumber(
      name: String!
      phone: String!
    ): User
  }
`

const resolvers = {
  Query: {
    userCount: async () => {
      const { data: usersData } = await axios.get('http://localhost:3000/users')
      return usersData.length
    },
    users: async (root, args) => {
      const { limit } = args
      const { data: usersData } = await axios.get('http://localhost:3000/users')
      return usersData.filter((user, index) => index < limit)
    },
    allUsers: async (root, args) => {
      try {
        const { data: usersData } = await axios.get('http://localhost:3000/users')
        if (!args.phone) return usersData
        const byPhone = user => args.phone === 'YES' ? user.phone : !user.phone
        return usersData.filter(byPhone)
      } catch (error) {
        throw new GraphQLError('Parameter error in the service.', {
          extensions: {
            code: 'BAD_REQUEST',
            response: error.code
          }
        })
      }
    },
    findUser: async (root, args) => {
      const { name } = args
      const { data: usersData } = await axios.get('http://localhost:3000/users')
      return usersData.find(user => user.name === name)
    }
  },
  Mutation: {
    addUser: async (root, args) => {
      const { data: usersData } = await axios.get('http://localhost:3000/users')
      if (usersData.find(user => user.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const user = { ...args, id: usersData.length + 1 }
      return user
    },
    editNumber: async (root, args) => {
      const { data: usersData } = await axios.get('http://localhost:3000/users')
      const userIndex = usersData.findIndex(user => user.name === args.name)
      if (userIndex === -1) return null
      const user = usersData[userIndex]
      const updatedUser = { ...user, phone: args.phone }
      usersData[userIndex] = updatedUser
      return updatedUser
    }
  },
  User: {
    detail: (root) => `${root.name}, ${root.email}`,
    address: (root) => ({ street: root.street })
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`🚀  Server ready at: ${url}`)
