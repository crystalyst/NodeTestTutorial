const PostsService = require('../../../src/services/posts.service');

let mockPostsRepository = {
    findAllPosts: jest.fn(),
    findOnePost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    countLike: jest.fn(),
    findLikes: jest.fn(),
};

describe('posts Service Layer Test', () => {
    let postsService = new PostsService();
    postsService.postsRepository = mockPostsRepository;
    postsService.likesRepository = mockPostsRepository;

    beforeEach(() => {
        // 모든 Mock을 초기화합니다.
        jest.resetAllMocks();
    });

    test('updatePost Method의 Success Case', async () => {
        const updatePostInput = {
            Id: 1,
            title: 'title',
            content: 'content',
            userId: 1,
        };
        const findOnePostReturnValue = [
            {
                postId: 1,
                userId: 1,
                nickname: 'nickname',
                title: 'title',
                like: 1,
                createdAt: new Date('14 December 2022 00:00'),
                updatedAt: new Date('14 December 2022 00:00'),
            },
        ];
        mockPostsRepository.findOnePost = jest.fn(() => {
            return findOnePostReturnValue;
        });
        const resultUpdate = 'postsModel에 있는 Update Method의 실행된 결과값';
        mockPostsRepository.updatePost = jest.fn(() => {
            return resultUpdate;
        });

        const updatePost = await postsService.updatePost(
            updatePostInput.Id,
            updatePostInput.title,
            updatePostInput.content,
            updatePostInput.userId
        );

        expect(mockPostsRepository.findOnePost).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.findOnePost).toHaveBeenCalledWith(
            updatePostInput.Id
        );

        expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.updatePost).toHaveBeenCalledWith(
            updatePostInput.Id,
            updatePostInput.title,
            updatePostInput.content
        );

        expect(updatePost).toEqual(resultUpdate);
    });
    test('updatePost Method의 Post Error Case', async () => {
        mockPostsRepository.findOnePost = jest.fn(() => {
            return [];
        });

        const updatePostInput = {
            Id: 99,
            title: 'title',
            content: 'content',
            userId: 1,
        };

        try {
            const updatePost = await postsService.updatePost(
                updatePostInput.Id,
                updatePostInput.title,
                updatePostInput.content,
                updatePostInput.userId
            );
        } catch (error) {
            expect(mockPostsRepository.findOnePost).toHaveBeenCalledTimes(1);
            expect(mockPostsRepository.findOnePost).toHaveBeenCalledWith(
                updatePostInput.Id
            );
            expect(error.message).toEqual("Post doesn't exist");
        }
    });
    test('updatePost Method의 User Error Case', async () => {
        const findOnePostReturnValue = [
            {
                postId: 1,
                userId: 1,
                nickname: 'nickname',
                title: 'title',
                like: 1,
                createdAt: new Date('14 December 2022 00:00'),
                updatedAt: new Date('14 December 2022 00:00'),
            },
        ];
        mockPostsRepository.findOnePost = jest.fn(() => {
            return findOnePostReturnValue;
        });

        const updatePostInput = {
            Id: 99,
            title: 'title',
            content: 'content',
            userId: 0,
        };

        try {
            const updatePost = await postsService.updatePost(
                updatePostInput.Id,
                updatePostInput.title,
                updatePostInput.content,
                updatePostInput.userId
            );
        } catch (error) {
            expect(mockPostsRepository.findOnePost).toHaveBeenCalledTimes(1);
            expect(mockPostsRepository.findOnePost).toHaveBeenCalledWith(
                updatePostInput.Id
            );
            expect(error.message).toEqual("You don't have permission");
        }
    });
});
