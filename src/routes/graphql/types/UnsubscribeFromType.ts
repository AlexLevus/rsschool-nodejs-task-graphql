import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql/type';

const UnsubscribeFromType = new GraphQLInputObjectType({
  name: 'UnsubscribeFromType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    unsubscribeFromId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export default UnsubscribeFromType;
