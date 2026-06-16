import { jest } from '@jest/globals';
import RefreshAuthenticationUseCase from '../use_case/RefreshAuthenticationUseCase.js';

describe('RefreshAuthenticationUseCase', () => {
    test('harus mengembalikan acces token kalau berhasil', async () => {
        const useCasePayload = {
            refreshToken: 'my_refresh_token_gw'
        }

        const mockAuthenticationRepository = {
            checkAvailabilityToken: jest.fn().mockResolvedValue()
        }

        const mockTokenManager = {
            verifyRefreshToken: jest.fn().mockResolvedValue(),
            decodePayload: jest.fn().mockResolvedValue({userId: 'user-123', username: 'username123'}),
            createAccessToken: jest.fn().mockResolvedValue('access_token_123')
        }

        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
            authenticationRepository: mockAuthenticationRepository,
            tokenManager: mockTokenManager
        });

        const result = await refreshAuthenticationUseCase.execute(useCasePayload);

        expect(result).toEqual({ accessToken: 'access_token_123' });

        expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith('my_refresh_token_gw');

        expect(mockTokenManager.verifyRefreshToken).toHaveBeenCalledWith('my_refresh_token_gw');

        expect(mockTokenManager.decodePayload).toHaveBeenCalledWith('my_refresh_token_gw');

        expect(mockTokenManager.createAccessToken).toHaveBeenCalledWith({ userId: 'user-123', username: 'username123'});
    });
});