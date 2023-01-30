import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';

const UpdatePostType = new GraphQLInputObjectType({
  name: 'UpdatePostType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export default UpdatePostType;
