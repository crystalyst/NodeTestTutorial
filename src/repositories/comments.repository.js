const { Op } = require('sequelize');
const { User, Comments } = require('../models');

class CommentsRepository {
    createComment = async (data) => {
        await Comments.create({
            content: data.content,
            userId: data.userId,
            postId: data.Id,
        });
    };

    findComments = async ({ Id }) => {
        return Comments.findAll({
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

    findComment = async ({ commentId }) => {
        const comment = await Comments.findOne({
            where: {
                [Op.or]: [{ commentId }],
            },
        });
        return comment;
    };

    updateComment = async ({ commentId, content }) => {
        const comment = await Comments.update(
            { content: content },
            { where: { commentId } }
        );
        return comment;
    };

    deleteComment = async ({ commentId }) => {
        const comment = await Comments.destroy({
            where: { commentId },
        });
        return comment;
    };
}
module.exports = CommentsRepository;
