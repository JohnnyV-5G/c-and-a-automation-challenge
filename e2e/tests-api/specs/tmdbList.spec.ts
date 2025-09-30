import { test, expect } from '@playwright/test';
import { movieIds } from '../utils/movieIDs';
import { saveJsonResponse } from '../utils/JsonResponseManager';
import { TMDB_API } from '../../tests-ui/utils/constants';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = TMDB_API.TMDB_BASE_URL_4;
const AUTH_TOKEN = process.env.TMDB_USER_ACCESS_TOKEN!;
const HEADERS = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json',
};

const bladeRunner49 = movieIds.bladeRunner2049; // Blade Runner 2049 https://www.themoviedb.org/movie/335984-blade-runner-2049
const originalBladeRunnerId = movieIds.bladeRunner1982; // Blade Runner (1982) https://www.themoviedb.org/movie/78-blade-runner

let listId: number;

test.describe.serial('TMDB API - List Management (E2E)', () => {  
  test('Create a new list', { tag: '@happy-path', }, async({ request }, testInfo) => {
    const response = await test.step('POST /list - Create a list', async () => {
      return await request.post(`${BASE_URL}/list`, {
        headers: HEADERS,
        data: {
          name: 'Sci-Fi Favorites',
          iso_639_1: 'en',
          description: 'Top science fiction picks',
          public: true,
        },
      });
    });

    const body = await response.json();
    saveJsonResponse(body, 'create-list-response', testInfo);


    await test.step('Validate creation response', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('id');
      expect(body.success).toBeTruthy();
      listId = body.id;
      console.log(`Created list with ID: ${listId}`);
    });
  });

  test('Update the list name and description', { tag: '@happy-path', }, async({ request }, testInfo) => {
    const response = await test.step('PUT /list/:id - Update list', async () => {
      return await request.put(`${BASE_URL}/list/${listId}`, {
        headers: HEADERS,
        data: {
          name: 'Updated Sci-Fi Collection',
          iso_639_1: 'en',
          description: 'Updated list of the best sci-fi movies',
          public: true,
        },
      });
    });

    const body = await response.json();
    saveJsonResponse(body, 'update-list-response', testInfo);

    await test.step('Validate update response', async () => {
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect([1, 12]).toContain(body.status_code); // 1: Created, 12: Updated
      expect(body.success).toBeTruthy();
    });
  });

  test('Add movies to the list', { tag: '@happy-path', }, async ({ request }, testInfo) => {
    const response = await test.step('POST /list/:id/items - Add movies', async () => {
      return await request.post(`${BASE_URL}/list/${listId}/items`, {
        headers: HEADERS,
        data: {
          items: [
            {
              media_type: 'movie',
              media_id: bladeRunner49, // Blade Runner 2049
            },
            {
              media_type: 'movie',
              media_id: originalBladeRunnerId, // Blade Runner (1982)
            },
          ],
        },
      });
    });

    const body = await response.json();
    saveJsonResponse(body, 'add-list-response', testInfo);
    
    await test.step('Validate movie additions', async () => {
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.status_code).toBe(1); // 1 = success
      expect(body.success).toBeTruthy();
    });
  });

  test('Remove the movie from the list', { tag: '@happy-path', }, async ({ request }, testInfo) => {
    const response = await test.step('DELETE /list/:id/items - Remove movie', async () => {
      return await request.delete(`${BASE_URL}/list/${listId}/items`, {
        headers: HEADERS,
        data: {
          items: [
            {
              media_type: 'movie',
              media_id: bladeRunner49,
            },
          ],
        },
      });
    });

    const body = await response.json();
    saveJsonResponse(body, 'remove-list-response', testInfo);
    
    await test.step('Validate movie removal', async () => {
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.status_code).toBe(1);
      expect(body.success).toBeTruthy();
    });
  });

  test('Clear the list', { tag: '@happy-path', }, async({ request }, testInfo) => {
    const response = await test.step('GET /list/:id/clear?confirm=true → Clear list', async () => {
      return await request.get(`${BASE_URL}/list/${listId}/clear?confirm=true`, {
        headers: HEADERS,
      });
    });

    const body = await response.json();
    saveJsonResponse(body, 'clear-list-response', testInfo);

    await test.step('Validate list clear operation', async () => {
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.status_code).toBe(1);
      expect(body.success).toBeTruthy();
      expect(body.items_deleted).toBeGreaterThanOrEqual(0);
    });
  });
});