import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
test.skip("Test Suite: Mock set for setups", () => {
    test('Search movie (TMDB v3)', async ({ request }) => {
        const apiKey = process.env.TMDB_V3_KEY!;
        const url = `https://api.themoviedb.org/3/search/movie?query=avatar&api_key=${apiKey}`;

  const res = await request.get(url);
  expect(res.status()).toBe(200);

  const data = await res.json();
  console.log('🎬 Found Movies:', data.results.map((m: any) => m.title));

  expect(data.results.length).toBeGreaterThan(0);
  expect(data.results[0]).toHaveProperty('title');
    });


test('GET list using TMDB v4', async ({ request }) => {
  const bearerToken = process.env.TMDB_USER_ACCESS_TOKEN!;
  const listId = 8201414; // Replace with your actual list ID if needed

  const res = await request.get(`https://api.themoviedb.org/4/list/${listId}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  expect(res.status()).toBe(200);

  const data = await res.json();
  console.log('List Data:', JSON.stringify(data, null, 2));

  // Basic assertions (structure-based)
  expect(data).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
    public: expect.any(Boolean),
    sort_by: expect.any(String),
    items: expect.any(Array),
  });
});
});
