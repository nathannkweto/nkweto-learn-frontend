import fs from 'fs';

const BASE_URL = process.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/v3/api-docs`;
const OUTPUT_PATH = './openapi.yaml';

async function fetchApiDocs() {
    try {
        console.log(`⏳ Fetching OpenAPI schema from ${API_URL}...`);

        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        fs.writeFileSync(OUTPUT_PATH, data);

        console.log(`✅ OpenAPI schema successfully saved to ${OUTPUT_PATH}`);
    } catch (error) {
        console.warn(`\n⚠️  WARNING: Could not fetch OpenAPI schema from backend.`);
        console.warn(`⚠️  Is your Spring Boot application running at ${API_URL}?`);
        console.warn(`⚠️  Falling back to the existing ${OUTPUT_PATH} (if it exists).\n`);
    }
}

fetchApiDocs();