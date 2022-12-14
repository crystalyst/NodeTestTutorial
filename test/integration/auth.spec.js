const supertest = require('supertest');
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

describe('auth-middleWare의 통합 테스트', () => {
    test('POST /api/users/login success', async () => {
        const requestBody = {
            nickname: 'nickname',
            password: '1234',
            confirmPassword: '1234',
        };
        const response = await supertest(app)
            .post('/api/users/signup')
            .send(requestBody);

        expect(response.status).toEqual(201);
    });
});
