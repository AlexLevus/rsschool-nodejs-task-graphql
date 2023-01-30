import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type';
import { MemberTypeType, PostType, ProfileType, UserType } from './types';

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, fastify) {
        return fastify.db.users.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, fastify) {
        return fastify.db.users.findOne(args.id);
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, fastify) {
        return fastify.db.profiles.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, fastify) {
        return fastify.db.posts.findOne({ key: 'id', equals: args.id });
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, fastify) {
        return fastify.db.memberTypes.findOne({
          key: 'id',
          equals: args.id,
        });
      },
    },
  },
});

export default query;
