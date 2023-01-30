import { GraphQLNonNull, GraphQLObjectType } from 'graphql/type';
import {
  CreatePostType,
  CreateProfileType,
  CreateUserType,
  MemberTypeType,
  PostType,
  ProfileType,
  SubscribeToType,
  UnsubscribeFromType,
  UpdateMemberTypeType,
  UpdatePostType,
  UpdateProfileType,
  UpdateUserType,
  UserType,
} from './types';
import isUUID from 'validator/lib/isUUID';

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        data: {
          type: new GraphQLNonNull(CreateUserType),
        },
      },
      resolve(parent, { data }, fastify) {
        return fastify.db.users.create(data);
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        data: {
          type: new GraphQLNonNull(CreateProfileType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const isProfileExists = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: data.userId,
        });
        const isMemberTypeExists = await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: data.memberTypeId,
        });

        if (isProfileExists || !isMemberTypeExists) {
          throw fastify.httpErrors.badRequest();
        }

        const profile = await fastify.db.profiles.create(data);
        if (!profile) {
          throw fastify.httpErrors.badRequest();
        }

        return profile;
      },
    },
    createPost: {
      type: PostType,
      args: {
        data: {
          type: new GraphQLNonNull(CreatePostType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const post = await fastify.db.posts.create(data);

        if (!post) {
          throw fastify.httpErrors.badRequest();
        }

        return post;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        user: {
          type: new GraphQLNonNull(UpdateUserType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const user = await fastify.db.users.findOne({
          key: 'id',
          equals: data.id,
        });

        if (!user) {
          throw fastify.httpErrors.badRequest();
        }

        return await fastify.db.users.change(data.id, data);
      },
    },
    updateProfile: {
      type: ProfileType,
      args: {
        profile: {
          type: new GraphQLNonNull(UpdateProfileType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const profile = await fastify.db.profiles.findOne({
          key: 'id',
          equals: data.id,
        });

        if (!profile) {
          throw fastify.httpErrors.badRequest();
        }

        return await fastify.db.profiles.change(profile.id, data);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        post: {
          type: new GraphQLNonNull(UpdatePostType),
        },
      },
      async resolve(parent, { data }, fastify) {
        if (!isUUID(data.id)) {
          throw fastify.httpErrors.badRequest();
        }

        const post = await fastify.db.posts.findOne({
          key: 'id',
          equals: data.id,
        });

        if (!post) {
          throw fastify.httpErrors.notFound();
        }

        return await fastify.db.posts.change(post.id, data);
      },
    },
    updateMemberType: {
      type: MemberTypeType,
      args: {
        memberType: {
          type: new GraphQLNonNull(UpdateMemberTypeType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const memberType = await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: data.id,
        });

        if (!memberType) {
          throw fastify.httpErrors.badRequest();
        }

        return await fastify.db.memberTypes.change(
          memberType.id,
          data
        );
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        data: {
          type: new GraphQLNonNull(SubscribeToType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const user = await fastify.db.users.findOne({
          key: 'id',
          equals: data.subscribeToId,
        });
        const userToSubscribe = await fastify.db.users.findOne({
          key: 'id',
          equals: data.id,
        });

        if (!user || !userToSubscribe) {
          throw fastify.httpErrors.badRequest();
        }

        const isUserSubscribed = user.subscribedToUserIds.includes(
          userToSubscribe.id
        );
        if (isUserSubscribed) {
          throw fastify.httpErrors.badRequest();
        }

        return await fastify.db.users.change(data.subscribeToId, {
          subscribedToUserIds: [...user.subscribedToUserIds, data.id],
        });
      },
    },
    unsubscribeFrom: {
      type: UserType,
      args: {
        data: {
          type: new GraphQLNonNull(UnsubscribeFromType),
        },
      },
      async resolve(parent, { data }, fastify) {
        const user = await fastify.db.users.findOne({
          key: 'id',
          equals: data.unsubscribeFromId,
        });
        const userToUnsubscribe = await fastify.db.users.findOne({
          key: 'id',
          equals: data.id,
        });

        if (!user) {
          throw fastify.httpErrors.badRequest();
        }

        if (!userToUnsubscribe) {
          throw fastify.httpErrors.badRequest();
        }

        const isUserSubscribed = user.subscribedToUserIds.includes(
          userToUnsubscribe.id
        );
        if (!isUserSubscribed) {
          throw fastify.httpErrors.badRequest();
        }

        return await fastify.db.users.change(data.unsubscribeFromId, {
          subscribedToUserIds: user.subscribedToUserIds.filter(
            (id: string) => id !== data.id
          ),
        });
      },
    },
  },
});

export default mutation;
