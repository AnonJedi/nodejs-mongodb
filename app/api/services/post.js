'use strict';


const PostModel           = require('../models/post');
const StreamModel         = require('../models/stream');
const UserModel           = require('../models/user');
const CommentModel        = require('../models/comment');
const constants           = require('../constants');
const ServiceException    = require('../exceptions/service-exception');


/**
 * Function for creation post
 * @param userId - id of post's author, mongoose type ObjectId
 * @param postText - body of new post, String
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 user: author of post
 *                                 post: created post
 *                               }
 */
module.exports.createPost = (userId, postText) => {
  let userData;
  return UserModel.findById(userId).exec()
    .then(user => {
      if (!user) {
        throw new ServiceException(`User with id ${userId} is not found`);
      }
      userData = user;
      return StreamModel.findById(user.stream_id).exec();
    })
    .then(stream => {
      const newPost = new PostModel({
        text: postText,
        followers: stream.followers,
        stream_id: stream._id
      });
      return newPost.save();
    })
    .then(newPost => (
      new Promise(resolve => {
        if (newPost) {
          resolve({user: userData, post: newPost});
        }
      })
    ));
};


/**
 * Function for getting post
 * @param postId - id of post, mongoose type ObjectId
 */
module.exports.getPost = postId => (
  PostModel.findById(postId).exec()
    .then(post => {
      if (!post) {
        throw new ServiceException(`Post with id '${postId}' is not found`);
      }
      return new Promise(resolve => {
        resolve({
          post: post
        })
      });
    })
);


/**
 * Function for fetch post list of user stream
 * @param userId - id of author of posts, mongoose type ObjectId
 * @param size - size of query page, Integer
 * @param offset - offset from begin in pages, Integer
 * @param sort - sorting parameters, not required, one of constants (look to constants.postSorting)
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 posts: array of posts,
 *                                 count: posts total,
 *                                 user: author of posts,
 *                                 offset: offset,
 *                                 size: size,
 *                                 sort: sort or 'date'
 *                               }
 */
module.exports.getPostList = (userId, size, offset, sort = 'date') => {

  //Set sorting, if not exists then default
  const sorting = constants.postSorting[sort] || constants.postSorting.date;

  let posts, user;

  return UserModel.findById(userId).exec()
    .then(dbUser => {
      user = dbUser;
      if (!user) {
        throw new ServiceException(`User with id ${userId} is not found`);
      }
      //Find all posts with user' stream id in main stream or in followers
      //list with bounds and sort it by 'sort' parameter
      return PostModel.find({
        $or: [{
          stream_id: dbUser.stream_id
        }, {
          'followers.stream_id': dbUser.stream_id
        }]
      })
        .sort(sorting)
        .skip(size * offset)
        .limit(size)
        .exec()
    })
    .then(dbPosts => {
      posts = dbPosts;
      //Fetch count of all user' posts
      return PostModel.find({
        $or: [{
          stream_id: user.stream_id
        }, {
          'followers.stream_id': user.stream_id
        }]
      })
        .count()
        .exec()
    })
    .then(count => (
      new Promise(resolve => {
        resolve({
          posts: posts,
          count: count,
          user: user,
          offset: offset,
          size: size,
          sort: sort || 'date'
        });
      })
    ));
};


/**
 * Function for update post text
 * @param userId - id of post's author, mongoose type ObjectId
 * @param postId - id of updated post, mongoose type ObjectId
 * @param text - new text of post, String
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 user: author,
 *                                 post: updated post
 *                               }
 */
module.exports.editPost = (userId, postId, text) => {
  let user;
  return UserModel.findById(userId).exec()
    .then(dbUser => {
      user = dbUser;
      return PostModel.findById(postId).exec();
    })
    .then(post => {
      //Is post exist check
      if (!post) {
        throw new ServiceException(`Post with id ${postId} is not found`);
      }

      //Is post belong to user check
      if (!user.stream_id.equals(post.stream_id)) {
        throw new ServiceException('User cannot edit posts of another users');
      }
      post.text = text;
      return post.save();
    })
    .then(updatedPost => (
      new Promise(resolve => {
        resolve({
          user: user,
          post: updatedPost
        });
      })
    ));
};

/**
 * Function for deletion user's post
 * @param userId - id of post's author, mongoose type ObjectId
 * @param postId - id of post for delete, mongoose type ObjectId
 * @returns {Promise.<>}
 */
module.exports.deletePost = (userId, postId) => {
  let user, post;
  return UserModel.findById(userId).exec()
    .then(dbUser => {
      user = dbUser;
      return PostModel.findById(postId).exec();
    })
    .then(dbPost => {
      //Check existing post
      if (!dbPost) {
        throw new ServiceException(`Post with id ${postId} is not found`);
      }
      post = dbPost;
      //Is post belong to user
      if (!user.stream_id.equals(post.stream_id)) {
        throw new ServiceException('User cannot remove posts of another users');
      }

      return CommentModel.remove({post_id: postId});
    })
    .then(() => (
      post.remove()
    ));
};


/**
 * Function for switch post's like
 * @param userId - user id which like/unlike post, mongoose type ObjectId
 * @param postId - liked/unliked post id, mongoose type ObjectId
 * @returns {Promise.<Object>} - object like
 *                               {
 *                                 user: user which like/unlike post,
 *                                 post: liked/unliked post
 *                               }
 */
module.exports.togglePostLike = (userId, postId) => {
  var user;
  return UserModel.findById(userId).exec()
    .then(dbUser => {
      user = dbUser;
      return PostModel.findById(postId).exec();
    })
    .then(post => {
      //Check post exist
      if (!post) {
        throw new ServiceException(`Post with id '${postId}' is not found`);
      }

      //Search user id in post' likes
      let likeInPost = -1;
      post.likes.every((item, i) => {
        if (item.user_id.equals(userId)) {
          likeInPost = i;
          return false;
        }
        return true;
      });

      //If user id in likes then pop it otherwise push
      if (likeInPost === -1) {
        post.likes.push({user_id: userId});
      } else {
        post.likes.splice(likeInPost, 1);
      }
      return post.save();
    })
    .then(updatedPost => (
      new Promise(function (resolve) {
        resolve({
          user: user,
          post: updatedPost
        })
      })
    ));
};