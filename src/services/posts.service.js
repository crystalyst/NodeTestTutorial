const PostsRepository = require('../repositories/posts.repository');
const LikesRepository = require('../repositories/likes.repositories');
const { Posts, Likes } = require('../models/index.js');

class PostsService {
    constructor() {
        (this.postsRepository = new PostsRepository(Posts)),
            (this.likesRepository = new LikesRepository(Likes));
    }

    findAllPosts = async () => {
        const posts = await this.postsRepository.findAllPosts();
        if (posts.length === 0) throw new Error("Post doesn't exist");

        return Promise.all(
            posts.map(async (post) => {
                const { postId, userId, title, createdAt, updatedAt } = post;
                const count = await this.likesRepository.countLike(postId);

                return {
                    postId: postId,
                    userId: userId,
                    nickname: post.User.nickname,
                    title: title,
                    like: count,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                };
            })
        );
    };

    findOnePost = async (Id) => {
        const post = await this.postsRepository.findOnePost(Id);
        if (post.length === 0) throw new Error("Post doesn't exist");

        return await Promise.all(
            post.map(async (post) => {
                const {
                    postId,
                    userId,
                    title,
                    content,
                    createdAt,
                    updatedAt,
                    User,
                } = post;
                const count = await this.likesRepository.countLike(postId);

                return {
                    postId: postId,
                    userId: userId,
                    nickname: User.nickname,
                    title: title,
                    content: content,
                    like: count,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                };
            })
        );
    };

    createPost = async (title, content, userId, nickname) => {
        await this.postsRepository.createPost({
            title,
            content,
            userId,
            nickname,
        });
    };

    updatePost = async (Id, title, content, userId) => {
        const post = await this.postsRepository.findOnePost(Id);
        if (post.length === 0) throw new Error("Post doesn't exist");
        if (userId !== post[0].userId)
            throw new Error("You don't have permission");

        return await this.postsRepository.updatePost(Id, title, content);
    };

    deletePost = async (Id) => {
        const post = await this.postsRepository.findOnePost(Id);
        if (post.length === 0) throw new Error("Post doesn't exist");

        await this.postsRepository.deletePost(Id);

        return post;
    };
}

module.exports = PostsService;
