import { ErrorResponseSchema } from '../../fixtures/api/schemas';
import { ErrorResponse } from '../../fixtures/api/types-guards';
import { test, expect } from '../../fixtures/test-options';
import invalidCredentials from '../../fixtures/data/invalidCredentials.json';

test.describe('Endpoint de usuários', () => {
  test('Verifica API para Login', { tag: '@api' }, async ({ apiRequest }) => {
    const { status, body } = await apiRequest<ErrorResponse>({
      method: 'POST',
      url: 'api/users/login',
      baseUrl: process.env.API_URL,
      body: {
        user: {
          email: invalidCredentials.invalidEmails[0],
          password: invalidCredentials.invalidPasswords[0],
        },
      },
    });

    expect(status).toBe(403);
    expect(ErrorResponseSchema.parse(body)).toBeTruthy();
  });
});
