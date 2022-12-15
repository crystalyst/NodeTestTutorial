const { Op } = require('sequelize');
const { Posts, User } = require('../models');
class LikesRepository {
    constructor(likesModel) {
        this.likes = likesModel;
    }
    findLike = async (Id, userId) => {
        return this.likes.findOne({
            where: {
                [Op.and]: [{ postId: Id }, { userId }],
            },
        });
    };

    findLikes = async (userId) => {
        return this.likes.findAll({
            where: {
                [Op.or]: [{ userId }],
            },
            include: [Posts],
        });
    };

    createLike = async (Id, userId) => {
        return this.likes.create({
            postId: Id,
            userId: userId,
        });
    };

    deleteLike = async (Id, userId) => {
        console.log(Id, userId);
        return this.likes.destroy({
            where: {
                [Op.and]: [{ postId: Id }, { userId: userId }],
            },
        });
    };
    countLike = async (postId) => {
        return this.likes.count({
            where: {
                [Op.or]: [{ postId }],
            },
        });
    };
}

module.exports = LikesRepository;
