/**
 * @jest-environment @dynatrace/js-runtime/lib/test-environment
 */

const fetchMock = jest.fn();
globalThis.fetch = fetchMock;

import { SSO_URL } from '../ui/app/constants/constants';
import { defaultRateCard } from '../ui/app/constants/Default_RateCard';
import { getSettingsData } from '../ui/app/utils/helpers';
import appFunction, { authenticate, getRateCardValuesWithToken } from './get-settings-values.function';
import type { SettingsSchemaType } from '../ui/app/interfaces/Interfaces';

jest.mock('../ui/app/utils/helpers', () => ({
  getSettingsData: jest.fn(),
  giveMeaningFullErrorMessage: jest.fn(() => 'Something went wrong!'),
}));

describe('authenticate', () => {
  test('should return an access token when authentication is successful', async () => {
    const mockToken = 'mockAccessToken';
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ access_token: mockToken }), { status: 200 }));

    const token = await authenticate(SSO_URL, 'client_id', 'client_secret', 'resource');
    expect(token).toBe(mockToken);
  });

  test('should throw an error when authentication fails', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401, statusText: 'Unauthorized' }));
    await expect(authenticate(SSO_URL, 'client_id', 'client_secret', 'resource')).rejects.toThrow(
      'Failed to authenticate: ',
    );
  });
});

describe('getRateCardValuesWithToken', () => {
  test('should return rate card values when API call is successful', async () => {
    const mockRateCardValues = [{ id: 1, value: '100' }];
    fetchMock.mockResolvedValue(new Response(JSON.stringify(mockRateCardValues), { status: 200 }));

    const result = await getRateCardValuesWithToken('https://mock-url.com', 'mockAccessToken');
    expect(result).toEqual(mockRateCardValues);
  });

  test('should throw an error when fetching rate card values fails', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500, statusText: 'Internal Server Error' }));
    await expect(getRateCardValuesWithToken('https://mock-url.com', 'mockAccessToken')).rejects.toThrow(
      'Failed to fetch rate card values: ',
    );
  });
});

describe('appFunction', () => {
  test('should return rate card values when authentication and API calls succeed', async () => {
    fetchMock.mockImplementation((url) => {
      if (url === SSO_URL) {
        return Promise.resolve(new Response(JSON.stringify({ access_token: 'mockAccessToken' }), { status: 200 }));
      }
    });

    const mockAppSettings: SettingsSchemaType = {
      rate_card_type: 'default',
    };

    (getSettingsData as jest.Mock).mockResolvedValue([{ value: mockAppSettings }]);

    const result = await appFunction();
    expect(result).toEqual({ data: defaultRateCard });
  });
});
