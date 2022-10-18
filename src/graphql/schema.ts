import 'graphql-import-node';
import * as rootDefs from './schemas/schema.graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers/resolvers';


let schema = makeExecutableSchema({
  typeDefs: [rootDefs],
  resolvers,
});

export default schema;
