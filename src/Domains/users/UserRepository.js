class UserRepository{
    async addUser(user) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyAvailableUsername(username) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getPasswordByUsername(username) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getIdByUsername(username) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getUserById(username) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async updateFullnameById(username) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteUser(id, client) {
        throw new Error('DOMAIN.USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    
}

export default UserRepository;