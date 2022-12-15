const { User } = require('../models');
const { Op } = require('sequelize');

class PostsRepository {
    constructor(postsModel) {
        this.posts = postsModel;
    }

    findAllPosts = async () => {
        return this.posts.findAll({
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                },
            ],
            order: [['updatedAt', 'desc']],
        });
    };

    findOnePost = async (Id) => {
        return this.posts.findAll({
            where: {
                [Op.or]: [{ postId: Id }],
            },
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                },
            ],
        });
    };

    createPost = async (data) => {
        await this.posts.create({
            title: data.title,
            content: data.content,
            userId: data.userId,
            nickname: data.nickname,
        });
    };

    updatePost = async (Id, title, content) => {
        return await this.posts.update(
            { title, content },
            { where: { postId: Id } }
        );
    };

    deletePost = async (Id) => {
        await this.posts.destroy({
            where: { postId: Id },
        });
    };
}

module.exports = PostsRepository;
