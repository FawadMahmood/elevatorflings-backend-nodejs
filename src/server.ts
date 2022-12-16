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

// @ts-ignore
import cron from 'node-cron'

var rootCas = require('ssl-root-cas').create();

require('https').globalAgent.options.ca = rootCas;



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
    key: fs.readFileSync('/etc/letsencrypt/live/elvator.appsstaging.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/elvator.appsstaging.com/fullchain.pem')
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


import mongoose = require('mongoose');
import { EventType } from './utils/types';
const Event: mongoose.Model<EventType> = require('./models/event');


cron.schedule('* * * * *',async () => {
  console.log('running a task every minute');
  Event.updateMany({$and:[{end_date:{$lt:new Date()}},{status:"AVAILABLE"}]},{
    $set:{
      available:false,
      status:"COMPLETED"
    }
  }).then(pastevents=>{
  });
});


startApolloServer();