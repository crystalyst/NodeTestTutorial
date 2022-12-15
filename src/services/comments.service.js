const CommentsRepository = require('../repositories/comments.repository');
const PostsRepository = require('../repositories/posts.repository');
const { Posts } = require('../models/index');

class CommentsService {
    constructor() {
        (this.commentsRepository = new CommentsRepository()),
            (this.postsRepository = new PostsRepository(Posts));
    }

    createComment = async (content, Id, userId) => {
        const post = await this.postsRepository.findOnePost(Id);
        if (post.length === 0) throw new Error("Post doesn't exist");

        await this.commentsRepository.createComment({
            Id,
            content,
            userId,
        });
    };

    findComments = async (Id) => {
        const post = await this.postsRepository.findOnePost(Id);
        if (post.length === 0) throw new Error("Post doesn't exist");

        const comments = await this.commentsRepository.findComments({ Id });
        if (comments.length === 0) throw new Error("Comment doesn't exist");

        return await comments.map((comment) => {
            return {
                CommentsId: comment.commentId,
                userId: comment.userId,
                nickname: comment.User.nickname,
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });
    };

    updateComment = async (commentId, content, userId) => {
        const comments = await this.commentsRepository.findComment({
            commentId,
        });
        if (!comments) throw new Error("comments doesn't exist");
        else if (userId !== comments.userId)
            throw new Error("You don't have permission");
        await this.commentsRepository.updateComment({ commentId, content });
    };

    deleteComment = async (commentId, userId) => {
        const comments = await this.commentsRepository.findComment({
            commentId,
        });
        if (!comments) throw new Error("comments doesn't exist");
        else if (userId !== comments.userId)
            throw new Error("You don't have permission");

        await this.commentsRepository.deleteComment({ commentId });
    };
}

module.exports = CommentsService;
