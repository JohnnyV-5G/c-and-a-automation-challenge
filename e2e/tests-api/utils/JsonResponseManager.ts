import fs from 'fs';
import path from 'path';
import { PATHS } from '../../constants';
import { TestInfo } from '@playwright/test';

export function saveJsonResponse(data: any, filename: string, testInfo?: TestInfo) {
    const dir = path.resolve(__dirname, PATHS.API_EVIDENCE);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${filename}.json`);
    const jsonString = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); //save to disk
    // Also attach to Playwright report if testInfo is provided
    if (testInfo) {
        testInfo.attach(`${filename}.json`, {
            body: jsonString,
            contentType: 'application/json',
        });
    }
}