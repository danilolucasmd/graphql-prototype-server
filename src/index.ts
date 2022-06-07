import { ApolloServer, gql } from 'apollo-server';
import admin from 'firebase-admin';

const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    bio: String!
  }

  type Query {
    users: [User]
    user(id: Int!): User
  }
`;

const resolvers = {
  Query: {
    async users() {
      const users = await admin.firestore().collection('users').get();

      return users.docs.map(user => user.data());
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});