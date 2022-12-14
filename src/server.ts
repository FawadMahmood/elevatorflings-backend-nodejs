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


var rootCas = require('ssl-root-cas').create();

require('https').globalAgent.options.ca = rootCas;


interface MyContext {
  token?: String;
}

const ISLOCAL = false;

async function startApolloServer() {
  const mHelper = new MongoHelper();
  mHelper.initiateMongoConnection();
  const app = express();
  const httpServer = http.createServer(app);



  var options = ISLOCAL? {}: {
    key: fs.readFileSync('/home/apiappsstaging/ssl/keys/bf5d9_e317d_eecd4bfd2eb6ef27bf57ca806726b906.key'),
    cert: fs.readFileSync('/home/apiappsstaging/ssl/certs/api_appsstaging_com_bf5d9_e317d_1700962103_3d787592e01882d69706b2e820e6e989.crt')
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