const UsersRepository = require('../repositories/users.repository');
const jwt = require('jsonwebtoken');

class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    signUp = async (nickname, password) => {
        const findUser = await this.usersRepository.findUser(nickname);
        if (findUser) throw new Error('Nickname already exists');

        await this.usersRepository.signUp(nickname, password);

        return findUser;
    };
    //토큰값이 undefined로 들어갈 때가 있다.
    login = async (nickname, password) => {
        const findUser = await this.usersRepository.findUser(nickname);

        if (!findUser || findUser.password !== password)
            throw new Error('nickname or password do not match');

        const token = jwt.sign(
            { userId: findUser.userId },
            process.env.SECRET,
            {
                expiresIn: 60 * 60 * 60,
            }
        );
        return token;
    };
}

module.exports = UsersService;
