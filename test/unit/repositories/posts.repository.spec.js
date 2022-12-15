const PostsRepository = require('../../../src/repositories/posts.repository');

const mockPostsModel = () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
});

describe('posts Repository Layer Test', () => {
    let postsRepository = new PostsRepository(mockPostsModel);

    beforeEach(() => {
        // 모든 Mock을 초기화합니다.
        jest.resetAllMocks();
    });

    test('updatePost Method의 Success Case', async () => {
        const updatePostInput = {
            Id: 1,
            title: 'title',
            content: 'content',
        };

        const resultUpdate = 'postsModel에 있는 Update Method의 실행된 결과값';
        postsRepository.posts.update = jest.fn(() => {
            return resultUpdate;
        });

        const post = await postsRepository.updatePost(
            updatePostInput.Id,
            updatePostInput.title,
            updatePostInput.content
        );
        expect(post).toEqual(resultUpdate);

        expect(postsRepository.posts.update).toHaveBeenCalledTimes(1);

        expect(postsRepository.posts.update).toHaveBeenCalledWith(
            { title: updatePostInput.title, content: updatePostInput.content },
            { where: { postId: updatePostInput.Id } }
        );
    });
});
