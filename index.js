import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const users = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    street: 'Kulas Light',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org'
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    street: 'Kulas Light'
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    street: 'Kulas Light'
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    username: 'Karianne',
    email: 'Julianne.OConner@kory.org',
    street: 'Kulas Light',
    phone: '493-170-9623 x156',
    website: 'kale.biz'
  }
]

const typeDefs = `#graphql
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
    allUsers: [User]!
    findUser(name: String!): User
  }

  type Mutation {
    addUser(
      name: String!
      username: String!
      email: String!
      street: String!
    ): User
  }
`

const resolvers = {
  Query: {
    userCount: () => users.length,
    users: (root, args) => {
      const { limit } = args
      return users.filter((user, index) => index < limit)
    },
    allUsers: () => users,
    findUser: (root, args) => {
      const { name } = args
      return users.find(user => user.name === name)
    }
  },
  Mutation: {
    addUser: (root, args) => {
      const user = { ...args, id: users.length + 1 }
      return user
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
