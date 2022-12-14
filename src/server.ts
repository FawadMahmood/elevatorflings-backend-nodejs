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
import https from 'https'
import fs from 'fs'

interface MyContext {
  token?: String;
}

const ISLOCAL = true;

async function startApolloServer() {
  const mHelper = new MongoHelper();
  mHelper.initiateMongoConnection();
  const app = express();
  const httpServer = http.createServer(app);



  var options = ISLOCAL? {}: {
    key: fs.readFileSync('/home/apiappsstaging/ssl/keys/c9b92_40289_6569433b8ad5475185d9c7e1be071b0f.key'),
    cert: fs.readFileSync('/home/apiappsstaging/ssl/certs/api_appsstaging_com_c9b92_40289_1677369599_99c8985018e4d3db1e09fce5ddc99351.crt')
  };

  const httpsServer = https.createServer(options, app);

  const wsServer = new Server({
    server:ISLOCAL ?httpServer: httpsServer,
    path: "/socket",
  });

  const serverCleanup = useServer({ schema }, wsServer);



  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer:ISLOCAL ?httpServer: httpsServer }),
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


  (ISLOCAL ? httpServer: httpsServer).listen({ port: process.env.PORT }, (): void =>
    console.log(`\n🚀 GraphQL is now running on http://localhost:${process.env.PORT}/graphql`)
  );
}


startApolloServer();