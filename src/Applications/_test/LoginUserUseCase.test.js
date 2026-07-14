import { jest } from '@jest/globals';
import LoginUserUseCase from '../use_case/LoginUserUseCase.js';

describe('LoginUserUseCase', () => {
    test('harus berhasil login dan mengembalikan access token dan refresh token', async () => {
        const useCasePayload = {
            username: 'budi',
            password: 'rahasia123'
        }

        const mockUserRepository = {
            getPasswordByUsername: jest.fn().mockResolvedValue('hashed_password'),
            getIdByUsername: jest.fn().mockResolvedValue('user-123'),
        }

        const mockPasswordHash = {
            comparePassword: jest.fn().mockResolvedValue(true)
        }

        const mockTokenManager = {
            createAccessToken: jest.fn().mockResolvedValue('access_token_123'),
            createRefreshToken:jest.fn().mockResolvedValue('refresh_token_123'),
        }

        const mockAuthenticationRepository = {
            addToken: jest.fn().mockResolvedValue()
        }

        const loginUserUseCase = new LoginUserUseCase({
            userRepository: mockUserRepository,
            authenticationRepository: mockAuthenticationRepository,
            tokenManager: mockTokenManager,
            passwordHash: mockPasswordHash
        });

        const result = await loginUserUseCase.execute(useCasePayload);

        expect(result).toEqual({
            accessToken: 'access_token_123',
            refreshToken:'refresh_token_123'
        });

        expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('budi');

        expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('budi');

        expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('rahasia123', 'hashed_password');

        expect(mockTokenManager.createAccessToken).toHaveBeenCalledWith({
            userId: 'user-123',
            username: 'budi'
        });

        expect(mockTokenManager.createRefreshToken).toHaveBeenCalledWith({
            userId: 'user-123',
            username: 'budi'
        });

        expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith('refresh_token_123', 'user-123');
    });

    test('harus error jika password salah', async () => {
        const useCasePayload = {
            username: 'budi',
            password: 'rahasia123'
        }

        const mockUserRepository = {
            getPasswordByUsername: jest.fn().mockResolvedValue('hashed_password'),
            getIdByUsername: jest.fn()
        }

        const mockPasswordHash = {
            comparePassword: jest.fn().mockResolvedValue(false),
        }

        const mockTokenManager = {
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
        }

        const mockAuthenticationRepository = {
            addToken: jest.fn()
        }

        const loginUserUseCase = new LoginUserUseCase({
            userRepository: mockUserRepository,
            authenticationRepository: mockAuthenticationRepository,
            tokenManager: mockTokenManager,
            passwordHash: mockPasswordHash,
        });


        expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrow('LOGIN_USER.WRONG_PASSWORD');

        expect(mockUserRepository.getIdByUsername).not.toHaveBeenCalled();
        expect(mockTokenManager.createAccessToken).not.toHaveBeenCalled();
        expect(mockTokenManager.createRefreshToken).not.toHaveBeenCalled();
        expect(mockAuthenticationRepository.addToken).not.toHaveBeenCalled();

    });
});