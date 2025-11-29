import axios from 'axios';
import { createAPI } from '../client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('createAPI', () => {
  const baseUrl = 'https://api.example.com';
  const api = createAPI({ baseUrl });

  describe('company.getById', () => {
    it('should call the correct endpoint with the given ID', async () => {
      const mockResponse = { id: '1234', name: 'Test Company' };
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await api.company.getById('1234');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/company.getById`,
        expect.objectContaining({ params: { id: '1234' } })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});