const PostsController = require('../../../src/controllers/posts.controller');

let mockPostsService = {
    findAllPosts: jest.fn(),
    findOnePost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
};

let mockRequest = {
    body: jest.fn(),
};

let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

describe('posts Service Layer Test', () => {
    let postsController = new PostsController();
    postsController.postsService = mockPostsService;

    beforeEach(() => {
        // 모든 Mock을 초기화합니다.
        jest.resetAllMocks();

        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
    });
    //  코드를 수정할 때 의미가 생긴다. 요청을 계속 보내지않고 코드 한줄로 테스트가 가능해서 유용하다.
    //  배포할 때 일일히 하나하나 요청 보내야하지만 테스트코드를 짜두고 통과하면 테스트코드를 짜둔 코드 한에선 기능에 문제가 없다.
    //  효율성을 높이기 위해서 하는 작업, 규모에 따라 다르다.

    //  PM팀, DB설계팀, API 명세서 팀, 테스트코드팀이 나뉘어져있고 그 명세대로 테스트 코드를 다 작성한다.
    //  인풋 아웃풋만 맞으면 된다.

    test('Posts Controller Update Method의 Success Case', async () => {
        //전역으로 빼기
        const updatePostBody = {
            title: 'title',
            content: 'content',
        };

        const updatePostParams = {
            Id: 1,
        };

        const updatePostUserId = {
            user: { userId: 1 },
        };

        mockRequest.body = updatePostBody;
        mockRequest.params = updatePostParams;
        mockResponse.locals = updatePostUserId;

        const updatePostReturnValue = '게시물을 수정하였습니다.';

        mockPostsService.updatePost = jest.fn(() => {
            return updatePostReturnValue;
        });
        await postsController.updatePost(mockRequest, mockResponse);

        expect(mockPostsService.updatePost).toHaveBeenCalledTimes(1);
        expect(mockPostsService.updatePost).toHaveBeenCalledWith(
            updatePostParams.Id,
            updatePostBody.title,
            updatePostBody.content,
            updatePostUserId.user.userId
        );

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: updatePostReturnValue,
        });
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    test('Posts Controller Update Method의 Invalid Body Error', async () => {
        const updatePostBody = {
            title: null,
            content: null,
        };

        const updatePostParams = {
            Id: 1,
        };

        const updatePostUserId = {
            user: { userId: 1 },
        };
        const updatePostReturnValue = 'InvalidParamsError';

        mockRequest.body = updatePostBody;
        mockRequest.params = updatePostParams;
        mockResponse.locals = updatePostUserId;

        await postsController.updatePost(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errorMessage: updatePostReturnValue,
        });
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    test('Posts Controller Update Method의 Invalid Params Error', async () => {
        const updatePostBody = {
            title: 'title',
            content: 'content',
        };

        const updatePostParams = {
            Id: null,
        };

        const updatePostUserId = {
            user: { userId: 1 },
        };
        const updatePostReturnValue = 'InvalidParamsError';

        mockRequest.body = updatePostBody;
        mockRequest.params = updatePostParams;
        mockResponse.locals = updatePostUserId;

        await postsController.updatePost(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errorMessage: updatePostReturnValue,
        });
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    test('Posts Controller Update Method의 Invalid userId Error', async () => {
        const updatePostBody = {
            title: 'title',
            content: 'content',
        };

        const updatePostParams = {
            Id: 1,
        };

        const updatePostUserId = {
            user: { userId: null },
        };
        const updatePostReturnValue = 'InvalidParamsError';

        mockRequest.body = updatePostBody;
        mockRequest.params = updatePostParams;
        mockResponse.locals = updatePostUserId;

        await postsController.updatePost(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errorMessage: updatePostReturnValue,
        });
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
});
