import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql/type';

const UpdateMemberTypeType = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

export default UpdateMemberTypeType;
