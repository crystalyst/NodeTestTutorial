const cookieParser = require('cookie-parser');
const supertest = require('supertest');
const { request } = require('../../src/app');
const app = require('../../src/app');
const { auth } = require('../../src/middleWares/auth');
const { sequelize } = require('../../src/models/index.js');

// FIXME: 실제 Production 환경일 경우 매우 위험한 방법입니다.
//  해당 테스트를 하기 위해선 DB 연결 상태에 대해서 명확하게 파악을 한 이후 진행해주세요.
beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') await sequelize.sync();
    else throw new Error('NODE_ENV가 test로 설정되어 있지 않습니다.');
});

afterAll(async () => {
    if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
    else throw new Error('NODE_ENV가 test로 설정되어 있지 않습니다.');
});

describe('signup의 통합 테스트', () => {
    test('POST /api/users/signup success', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
            confirmPassword: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            message: '회원 가입에 성공하였습니다.',
        });
    });
    test('POST /api/users/signup bodyError ', async () => {
        const requestBody = {};
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errorMessage: 'InvalidParamsError',
        });
    });
    test('POST /api/users/signup nicknameError ', async () => {
        const requestBody = {
            nickname: '!nickname',
            password: '1234',
            confirmPassword: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(412);
        expect(response.body).toEqual({
            errorMessage: '닉네임의 형식이 일치하지 않습니다.',
        });
    });
    test('POST /api/users/signup alreadyNicknameError ', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
            confirmPassword: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errorMessage: 'Nickname already exists',
        });
    });
    test('POST /api/users/signup confirmPasswordError ', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
            confirmPassword: '1244',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(412);
        expect(response.body).toEqual({
            errorMessage: '패스워드가 일치하지 않습니다.',
        });
    });
    test('POST /api/users/signup passwordLengthError ', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '123',
            confirmPassword: '123',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(412);
        expect(response.body).toEqual({
            errorMessage: '패스워드의 형식이 일치하지 않습니다.',
        });
    });
    test('POST /api/users/signup includesError ', async () => {
        const requestBody = {
            nickname: '김11234영재',
            password: '1234',
            confirmPassword: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(412);
        expect(response.body).toEqual({
            errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
        });
    });
});

describe('login의 통합 테스트', () => {
    test('POST /api/users/login success', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/login')
            .send(requestBody);

        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            token: response.body.token,
        });
    });
    test('POST /api/users/login bodyError', async () => {
        const requestBody = {
            nickname: 'nickname1',
            password: '12345',
        };
        const response = await supertest(app)
            .post('/api/users/login')
            .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errorMessage: 'nickname or password do not match',
        });
    });
});

describe('auth의 통합 테스트', () => {
    test('POST auth middleware success', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/login')
            .send(requestBody);

        expect(response.status).toEqual(201);
        expect(response.body).toEqual({
            token: response.body.token,
        });
    });
    test('POST /api/users/login alreadyCookieError', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
        };
        const loginResponse = await supertest(app)
            .post('/api/users/login')
            .send(requestBody);

        const response = await supertest(app)
            .post('/api/users/login')
            .send(requestBody)
            .set('Cookie', [
                `authorization=Bearer%${loginResponse.body.token}`,
            ]);

        expect(response.status).toEqual(403);
        expect(response.body).toEqual({
            errorMessage: '이미 로그인이 되어있습니다.',
        });
    });
});
