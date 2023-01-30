import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';

const UpdateProfileType = new GraphQLInputObjectType({
  name: 'UpdateProfileType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
  },
});

export default UpdateProfileType;
