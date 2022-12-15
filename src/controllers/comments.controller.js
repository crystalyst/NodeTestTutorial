const CommentsService = require('../services/comments.service');

class CommentsController {
    constructor() {
        this.commentsService = new CommentsService();
    }

    createComment = async (req, res) => {
        try {
            const { Id } = req.params;
            const { content } = req.body;
            const { userId, nickname } = res.locals.user;

            if (!content || !userId || !Id || !nickname) {
                return res.status(412).json({
                    errorMessage: '데이터의 형식이 올바르지 않습니다..',
                });
            }
            await this.commentsService.createComment(content, Id, userId);

            res.status(201).json({ message: '댓글이 생성되었습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '댓글 작성에 실패하였습니다.',
            });
        }
    };

    findComments = async (req, res) => {
        try {
            const { Id } = req.params;

            const comments = await this.commentsService.findComments(Id);

            res.json({ data: comments });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: error.message,
            });
        }
    };

    updateComment = async (req, res) => {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            const { userId } = res.locals.user;

            if (!content || !commentId || !userId) {
                return res
                    .status(412)
                    .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
            }
            await this.commentsService.updateComment(
                commentId,
                content,
                userId
            );
            res.json({ message: '댓글을 수정하였습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: error.message,
            });
        }
    };
    // 에러
    deleteComment = async (req, res) => {
        try {
            const { commentId } = req.params;
            const { userId } = res.locals.user;

            if (!commentId || !userId) throw new Error('InvalidParamsError');

            await this.commentsService.deleteComment(commentId, userId);

            res.status(200).json({ message: '댓글이 삭제되었습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '댓글 삭제에 실패하였습니다.',
            });
        }
    };
}

module.exports = CommentsController;
