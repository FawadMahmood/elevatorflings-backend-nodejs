const dotenv = require('dotenv');
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import schema from './graphql/schema';
import { MongoHelper } from './helpers/mongoHelpers';
import compression from 'compression';
import depthLimit from 'graphql-depth-limit';
import { Server } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';


interface MyContext {
  token?: String;
}

async function startApolloServer() {
  const mHelper = new MongoHelper();
  mHelper.initiateMongoConnection();
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new Server({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);



  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    validationRules: [depthLimit(7)],
    introspection: true,
    formatError(formattedError, error) {
      return {
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions?.code
        }
      }
    },
  });

  await server.start();
  app.use('/graphql',
    cors<cors.CorsRequest>(),
    compression(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return await mHelper.validateUser(req);
      },
    }),
  );


  httpServer.listen({ port: process.env.PORT }, (): void =>
    console.log(`\n🚀 GraphQL is now running on http://localhost:${process.env.PORT}/graphql`)
  );
}


startApolloServer();