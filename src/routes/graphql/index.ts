import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {graphql, GraphQLSchema, parse, validate} from 'graphql';
import query from './query';
import mutation from './mutation';
import depthLimit = require('graphql-depth-limit');

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      if (!request.body.query) {
        throw fastify.httpErrors.badRequest();
      }

      const schema = new GraphQLSchema({ query, mutation });

      const errors = validate(schema, parse(request.body.query), [depthLimit(10)]);
      if (errors.length > 0) {
        return {
          errors,
          data: null
        }
      }

      return graphql({
        schema,
        source: request.body.query,
        variableValues: request.body.variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
