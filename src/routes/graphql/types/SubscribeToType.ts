import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql/type';

const SubscribeToType = new GraphQLInputObjectType({
  name: 'SubscribeToType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    subscribeToId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export default SubscribeToType;
