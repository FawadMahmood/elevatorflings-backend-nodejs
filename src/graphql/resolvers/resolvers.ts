import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../models/context';
import { IResolvers } from '@graphql-tools/utils';
import { BlogsController } from '../../controllers/blogs.controller';
import { CommentsController } from '../../controllers/comments.controller';
// import { AppConstants } from '../../constants/app.constants';
import { UsersController } from '../../controllers/users.controller';

const blogController = new BlogsController();
const commentsController = new CommentsController();
const usersController = new UsersController();

const resolvers: IResolvers = {
  Query: {
    blog: (_: void, args: any, ctx: Context, _info: GraphQLResolveInfo) => {
      return blogController.getBlog(args, ctx);
    },
    blogs: (_: void, args: any, ctx: Context, _info: GraphQLResolveInfo) => {
      return blogController.getBlogs(args, ctx);
    },
    // signin: (_, args: any, ctx: Context) => {
    //   return usersController.authenticateUser(args, ctx);
    // },
  },

  Mutation: {
    addBlog: async (_: any, args: any, ctx: Context) => {
      return blogController.addBlog(args, ctx);
    },
    updateBlog: async (_: any, args: any, ctx: Context) => {
      return blogController.updateBlog(args, ctx);
    },
    deleteBlog: async (_: any, args: any, ctx: Context) => {
      return blogController.deleteBlog(args, ctx);
    },
    addComment: async (_: any, args: any, ctx: Context) => {
      return commentsController.addComment(args, ctx);
    },
    updateComment: async (_: any, args: any, ctx: Context) => {
      return commentsController.updateComment(args, ctx);
    },
    deleteComment: async (_: any, args: any, ctx: Context) => {
      return commentsController.deleteComment(args, ctx);
    },
    addUser: async (_: any, args: any, ctx: Context) => {
      return usersController.addUser(args, ctx);
    },
    updateUser: async (_: any, args: any, ctx: Context) => {
      return usersController.updateUser(args, ctx);
    },
    requestOtp: async (_: any, args: any, ctx: Context) => {
      return usersController.requestOtp(args, ctx);
    },
    verifyOtp: async (_: any, args: any, ctx: Context) => {
      return usersController.verifyOtp(args, ctx);
    },
    resetPassword: async (_: any, args: any, ctx: Context) => {
      return usersController.resetPassword(args, ctx);
    },
    signIn: async (_: any, args: any, ctx: Context) => {
      return usersController.authenticateUser(args, ctx);
    },
    setLocation: async (_: any, args: any, ctx: Context) => {
      return usersController.setLocation(args, ctx);
    }
  },
};

export default resolvers;
