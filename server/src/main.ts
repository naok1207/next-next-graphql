import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.getInstance().removeAllContentTypeParsers();
  fastifyAdapter
    .getInstance()
    .addContentTypeParser('*', { bodyLimit: 0 }, (_request, _payload, done) => {
      done(null, null);
    });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bodyParser: false,
      // cors: {
      //   origin: 'http://localhost:3000',
      //   credentials: true,
      // },
    },
  );
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
