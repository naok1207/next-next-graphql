import { promises as fs } from 'fs';
import {
  All,
  Controller,
  OnModuleDestroy,
  OnModuleInit,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApolloServer, BaseContext } from '@apollo/server';
import {
  executeHTTPGraphQLRequest,
  FormidableFile,
  Raw,
  Request,
  Response,
} from '@node-libraries/nest-apollo-server';
import { AuthGuard } from '@nestjs/passport';

export const typeDefs = `
  # Return date
  scalar Date
  type Query {
    date: Date!
    posts: [Post]
  }

  # Return file information
  type File {
    name: String!
    type: String!
    value: String!
  }
  scalar Upload
  type Mutation {
    upload(file: Upload!): File!
  }

  type Post {
    id: String!
    title: String!
    content: String!
  }
`;

// type Payload = {
//   sub: string;
//   name: string;
//   iat: number;
// };

type Payload = string;

export const resolvers = {
  Query: {
    date: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return new Date();
    },
    posts: async (parent, args, contextValue, info) => {
      console.log({ parent, args, contextValue, info });
      return [{ id: '1', title: 'title', content: 'content' }];
    },
  },
  Mutation: {
    upload: async (_context, { file }: { file: FormidableFile }) => {
      return {
        name: file.originalFilename,
        type: file.mimetype,
        value: await fs.readFile(file.filepath, { encoding: 'utf8' }),
      };
    },
  },
};

interface MyContext extends BaseContext {
  user?: Payload;
}

@Controller('/graphql')
export class GraphqlController implements OnModuleInit, OnModuleDestroy {
  apolloServer: ApolloServer;
  onModuleInit() {
    this.apolloServer = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
    });
    return this.apolloServer.start();
  }
  onModuleDestroy() {
    this.apolloServer.stop();
  }
  @UseGuards(AuthGuard('jwt'))
  @All()
  async graphql(@Req() req: Request, @Res() res: Response) {
    await executeHTTPGraphQLRequest<MyContext>({
      req,
      res,
      apolloServer: this.apolloServer,
      context: async () => {
        // @ts-ignore
        const result = { req: Raw(req), res: Raw(res), user: req.user };
        return result;
      },
      options: {
        //Maximum upload file size set at 10 MB
        maxFileSize: 10 * 1024 * 1024,
      },
    });
  }
}
