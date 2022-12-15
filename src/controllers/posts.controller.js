const PostsService = require('../services/posts.service');

class PostsController {
    constructor() {
        this.postsService = new PostsService();
    }

    findAllPosts = async (req, res, next) => {
        try {
            const posts = await this.postsService.findAllPosts();

            res.json({
                data: posts,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '게시글 조회에 실패하였습니다.',
            });
        }
    };

    findOnePost = async (req, res, next) => {
        try {
            const { Id } = req.params;

            const post = await this.postsService.findOnePost(Id);

            res.status(200).json({ data: post });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: '게시글 조회에 실패하였습니다.',
            });
        }
    };

    createPost = async (req, res) => {
        try {
            const { title, content } = req.body;
            const { userId, nickname } = res.locals.user;

            if (!title || !content || !userId || !nickname) {
                return res.status(412).json({
                    errorMessage: '데이터의 형식이 올바르지 않습니다..',
                });
            }
            await this.postsService.createPost(
                title,
                content,
                userId,
                nickname
            );

            res.status(201).json({ Message: '게시글 작성에 성공하였습니다.' });
        } catch (error) {
            res.status(400).json({
                errorMessage: '게시글 작성에 실패하였습니다.',
            });
        }
    };

    updatePost = async (req, res) => {
        try {
            const { Id } = req.params;
            const { title, content } = req.body;
            const { userId } = res.locals.user;

            if ((!title && !content) || !Id || !userId)
                throw new Error('InvalidParamsError');

            await this.postsService.updatePost(Id, title, content, userId);

            return res
                .status(201)
                .json({ message: '게시물을 수정하였습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: error.message,
            });
        }
    };

    deletePost = async (req, res) => {
        try {
            const { Id } = req.params;
            const { userId } = res.locals.user;

            if (!Id || !userId) throw new Error('InvalidParamsError');

            await this.postsService.deletePost(Id, userId);

            res.json({ message: '게시물을 삭제하였습니다.' });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                errorMessage: error.message,
            });
        }
    };
}

module.exports = PostsController;
