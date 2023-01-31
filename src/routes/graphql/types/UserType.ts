import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from 'graphql/type';
import GraphQLProfile from './ProfileType';
import GraphQLPost from './PostType';
import GraphQLMemberType from './MemberTypeType';

const UserType: GraphQLOutputType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      resolve: async (parent, _, fastify) =>
        fastify.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        }),
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (parent, _, fastify) =>
        fastify.db.posts.findMany({
          key: 'userId',
          equals: parent.id,
        }),
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (parent, args, fastify) => {
        const userProfile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: parent.id,
        });

        if (userProfile === null) {
          return null;
        }

        return fastify.db.memberTypes.findOne({
          key: 'id',
          equals: userProfile.memberTypeId,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, fastify) =>
        Promise.all(
          parent.subscribedToUserIds.map(async (subscribedToUserId: string) =>
            fastify.db.users.findOne({ key: 'id', equals: subscribedToUserId })
          )
        ),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args, fastify) =>
        fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: parent.id,
        }),
    },
  }),
});

export default UserType;
