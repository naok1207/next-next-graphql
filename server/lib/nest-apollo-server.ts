// https://zenn.dev/sora_kumo/articles/4160c573a7e02c#%E4%BB%8A%E5%9B%9E%E4%BD%BF%E3%81%A3%E3%81%9F%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6
import { promises as fs } from 'fs';
import { parse } from 'url';
import formidable from 'formidable';
import {
  ApolloServer,
  BaseContext,
  ContextThunk,
  GraphQLRequest,
  HeaderMap,
  HTTPGraphQLRequest,
} from '@apollo/server';
import { IncomingMessage, ServerResponse } from 'http';

export type Request = IncomingMessage | { raw: IncomingMessage };
export type Response = ServerResponse | { raw: ServerResponse };

/**
 * Request parameter conversion options
 */
export type FormidableOptions = formidable.Options;

/**
 * File type used by resolver
 */
export type FormidableFile = formidable.File;

/**
 * Convert Requests and Responses for compatibility between Express and Fastify
 */
export const Raw = <T extends IncomingMessage | ServerResponse>(
  req: T | { raw: T },
) => ('raw' in req ? req.raw : req);

/**
 * Converting NextApiRequest to Apollo's Header
 * Identical header names are overwritten by later values
 * @returns Header in Map format
 */
export const createHeaders = (req: IncomingMessage): HeaderMap =>
  new HeaderMap(
    Object.entries(req.headers).flatMap<[string, string]>(([key, value]) =>
      Array.isArray(value)
        ? value.flatMap<[string, string]>((v) => (v ? [[key, v]] : []))
        : value
        ? [[key, value]]
        : [],
    ),
  );

/**
 *  Retrieve search from NextApiRequest
 * @returns search
 */
export const createSearch = (req: IncomingMessage) =>
  parse(req.url ?? '').search ?? '';

/**
 * Make GraphQL requests multipart/form-data compliant
 * @returns [body to be set in executeHTTPGraphQLRequest, function for temporary file deletion]
 */
export const createBody = (
  req: IncomingMessage,
  options?: formidable.Options,
) => {
  const form = formidable(options);
  return new Promise<[GraphQLRequest, () => void]>((resolve, reject) => {
    form.parse(req, async (error, fields, files) => {
      if (error) {
        reject(error);
      } else if (!req.headers['content-type']?.match(/^multipart\/form-data/)) {
        resolve([
          fields,
          () => {
            //
          },
        ]);
      } else {
        if (
          'operations' in fields &&
          'map' in fields &&
          typeof fields.operations === 'string' &&
          typeof fields.map === 'string'
        ) {
          const request = JSON.parse(fields.operations);
          const map: { [key: string]: [string] } = JSON.parse(fields.map);
          Object.entries(map).forEach(([key, [value]]) => {
            value.split('.').reduce((a, b, index, array) => {
              if (array.length - 1 === index) a[b] = files[key];
              else return a[b];
            }, request);
          });
          const removeFiles = () => {
            Object.values(files).forEach((file) => {
              if (Array.isArray(file)) {
                file.forEach(({ filepath }) => {
                  fs.rm(filepath);
                });
              } else {
                fs.rm(file.filepath);
              }
            });
          };
          resolve([request, removeFiles]);
        } else {
          reject(Error('multipart type error'));
        }
      }
    });
  });
};

/**
 * Creating methods
 * @returns method string
 */
export const createMethod = (req: IncomingMessage) => req.method ?? '';

/**
 * Execute a GraphQL request
 */
export const executeHTTPGraphQLRequest = async <Context extends BaseContext>({
  req: reqSrc,
  res: resSrc,
  apolloServer,
  options,
  context,
}: {
  req: Request;
  res: Response;
  apolloServer: ApolloServer<Context>;
  context: ContextThunk<Context>;
  options?: FormidableOptions;
}) => {
  const req = Raw(reqSrc);
  const res = Raw(resSrc);
  const [body, removeFiles] = await createBody(req, options);
  try {
    const httpGraphQLRequest: HTTPGraphQLRequest = {
      method: createMethod(req),
      headers: createHeaders(req),
      search: createSearch(req),
      body,
    };
    const result = await apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context,
    });
    res.statusCode = result.status ?? 200;
    result.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    if (result.body.kind === 'complete') {
      res.end(result.body.string);
    } else {
      for await (const chunk of result.body.asyncIterator) {
        res.write(chunk);
      }
      res.end();
    }
    return result;
  } finally {
    removeFiles();
  }
};
