import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const BASELINE_PATH = path.resolve('docs/openapi.json');
const SWAGGER_URL = 'http://localhost:5000/api/docs-json';

function fetchCurrentSwagger() {
  return new Promise((resolve, reject) => {
    http.get(SWAGGER_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse current OpenAPI JSON: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch from ${SWAGGER_URL}: ${err.message}`));
    });
  });
}

function canonicalize(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = canonicalize(obj[key]);
      return acc;
    }, {});
}

async function run() {
  if (!fs.existsSync(BASELINE_PATH)) {
    console.error(`Baseline not found at ${BASELINE_PATH}`);
    process.exit(1);
  }

  const rawBaseline = fs.readFileSync(BASELINE_PATH, 'utf8').replace(/^\uFEFF/, '');
  const baseline = JSON.parse(rawBaseline);
  const current = await fetchCurrentSwagger();

  const baselineCanonical = JSON.stringify(canonicalize(baseline), null, 2);
  const currentCanonical = JSON.stringify(canonicalize(current), null, 2);

  if (baselineCanonical === currentCanonical) {
    console.log('✅ OpenAPI contract matches baseline exactly (0 diff).');
    process.exit(0);
  } else {
    console.error('❌ OpenAPI contract diff detected!');
    // Output path diff summary
    const baselinePaths = Object.keys(baseline.paths || {}).sort();
    const currentPaths = Object.keys(current.paths || {}).sort();
    
    const missing = baselinePaths.filter((p) => !currentPaths.includes(p));
    const added = currentPaths.filter((p) => !baselinePaths.includes(p));

    if (missing.length > 0) {
      console.error('Missing paths:', missing);
    }
    if (added.length > 0) {
      console.error('Unexpected added paths:', added);
    }
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
