import withTransaction from '../../Infrastructures/database/transaction.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class DeleteUserUseCase {
    constructor({ userRepository, authenticationRepository}) {
        this._userRepository = userRepository;
        this._authenticationRepository = authenticationRepository;
    }

    async execute({ userId }) {
        // 
        await this._userRepository.getUserById(userId);

        await withTransaction(async (client) => {
            await this._authenticationRepository.deleteAllTokenByUserId(userId, client);
            await this._userRepository.deleteUser(userId, client);
        });
    }

}

export default DeleteUserUseCase;