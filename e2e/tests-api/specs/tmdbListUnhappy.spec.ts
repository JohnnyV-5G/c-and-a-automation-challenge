import { test, expect } from '@playwright/test';
import { saveJsonResponse } from '../utils/JsonResponseManager';
import dotenv from 'dotenv';
import { TMDB_API } from '../../tests-ui/utils/constants';

dotenv.config();

const BASE_URL = TMDB_API.TMDB_BASE_URL_4;
const HEADERS = {
  Authorization: `Bearer ${process.env.TMDB_USER_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

test.describe('TMDB API - Unhappy Paths', () => {
  test('Create a list with invalid token', { tag: '@unhappy-path' }, async ({ request }, testInfo) => {
    const invalidHeaders = {
      ...HEADERS,
      Authorization: 'Bearer invalid_token',
    };

    const response = await request.post(`${BASE_URL}/list`, {
      headers: invalidHeaders,
      data: {
        name: 'Should Fail',
        iso_639_1: 'en',
        description: 'Testing invalid token',
        public: true,
      },
    });

    const body = await response.json();
    saveJsonResponse(body, 'invalid-token-create-list', testInfo);

    expect(response.status()).toBe(401);
    expect(body.status_code).toBe(7); // Invalid API key
    expect(body.success).toBeFalsy();
  });

  test('Create a list with missing body', { tag: '@unhappy-path' }, async ({ request }, testInfo) => {
    const response = await request.post(`${BASE_URL}/list`, {
      headers: HEADERS,
      data: {}, // missing required fields
    });

    const body = await response.json();
    saveJsonResponse(body, 'missing-body-create-list', testInfo);

    expect(response.status()).toBe(400);
    expect(body.status_code).toBe(5); // Validation failed
    expect(body.success).toBeFalsy();
  });

  test('Add invalid movie ID to list', { tag: '@unhappy-path' }, async ({ request }, testInfo) => {
    const fakeListId = 99999999;

    const response = await request.post(`${BASE_URL}/list/${fakeListId}/items`, {
      headers: HEADERS,
      data: {
        items: [
          {
            media_type: 'movie',
            media_id: 9999999999, // Invalid movie
          },
        ],
      },
    });

    const body = await response.json();
    saveJsonResponse(body, 'invalid-movie-id', testInfo);

    expect(response.status()).toBe(404);
    expect(body.status_code).toBe(34); // Not found
    expect(body.success).toBeFalsy();
  });

  test('Clear list without confirm=true', { tag: '@unhappy-path' }, async ({ request }, testInfo) => {
    const fakeListId = 99999999;

    const response = await request.get(`${BASE_URL}/list/${fakeListId}/clear`, {
      headers: HEADERS,
    });

    const body = await response.json();
    saveJsonResponse(body, 'clear-list-missing-confirm', testInfo);

    expect(response.status()).toBe(404);//
    expect(body.status_code).toBe(34); // Validation failed 18
    expect(body.success).toBeFalsy();
  });

  test('Delete item with missing media_type', { tag: '@unhappy-path' }, async ({ request }, testInfo) => {
    const fakeListId = 12345678;

    const response = await request.delete(`${BASE_URL}/list/${fakeListId}/items`, {
      headers: HEADERS,
      data: {
        items: [
          {
            media_id: 335984, // Missing media_type
          },
        ],
      },
    });

    const body = await response.json();
    saveJsonResponse(body, 'delete-missing-media-type', testInfo);

    expect(response.status()).toBe(404);    // 400
    expect(body.status_code).toBe(34); // Validation failed
    expect(body.success).toBeFalsy();
  });

});
