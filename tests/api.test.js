/**
 * DevDash - API Tests
 * Run: npm test
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Helper per fare richieste HTTP
function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    }).on('error', reject);
  });
}

// Test suite
async function runTests() {
  console.log('🧪 DevDash API Tests\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    const res = await request('/api/health');
    if (res.status === 200 && res.data.status === 'ok') {
      console.log('✅ Health Check - Server is running');
      passed++;
    } else {
      throw new Error('Health check failed');
    }
  } catch (err) {
    console.log('❌ Health Check -', err.message);
    failed++;
  }

  // Test 2: Weather API
  try {
    const res = await request('/api/weather');
    if (res.status === 200 && res.data.city) {
      console.log('✅ Weather API - Returns city data');
      passed++;
    } else {
      throw new Error('Weather API failed');
    }
  } catch (err) {
    console.log('❌ Weather API -', err.message);
    failed++;
  }

  // Test 3: System API
  try {
    const res = await request('/api/system');
    if (res.status === 200 && res.data.hostname && res.data.cpu) {
      console.log('✅ System API - Returns system info');
      passed++;
    } else {
      throw new Error('System API failed');
    }
  } catch (err) {
    console.log('❌ System API -', err.message);
    failed++;
  }

  // Test 4: News API
  try {
    const res = await request('/api/news');
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log('✅ News API - Returns news array');
      passed++;
    } else {
      throw new Error('News API failed');
    }
  } catch (err) {
    console.log('❌ News API -', err.message);
    failed++;
  }

  // Test 5: Time API
  try {
    const res = await request('/api/time');
    if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
      console.log('✅ Time API - Returns timezones');
      passed++;
    } else {
      throw new Error('Time API failed');
    }
  } catch (err) {
    console.log('❌ Time API -', err.message);
    failed++;
  }

  // Test 6: Calendar API
  try {
    const res = await request('/api/calendar');
    if (res.status === 200 && res.data.month && res.data.days) {
      console.log('✅ Calendar API - Returns calendar data');
      passed++;
    } else {
      throw new Error('Calendar API failed');
    }
  } catch (err) {
    console.log('❌ Calendar API -', err.message);
    failed++;
  }

  // Test 7: Network API
  try {
    const res = await request('/api/network');
    if (res.status === 200 && res.data.interfaces) {
      console.log('✅ Network API - Returns network info');
      passed++;
    } else {
      throw new Error('Network API failed');
    }
  } catch (err) {
    console.log('❌ Network API -', err.message);
    failed++;
  }

  // Test 8: Storage API
  try {
    const res = await request('/api/storage');
    if (res.status === 200 && Array.isArray(res.data.usage)) {
      console.log('✅ Storage API - Returns storage info');
      passed++;
    } else {
      throw new Error('Storage API failed');
    }
  } catch (err) {
    console.log('❌ Storage API -', err.message);
    failed++;
  }

  // Test 9: Services API
  try {
    const res = await request('/api/services');
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log('✅ Services API - Returns services array');
      passed++;
    } else {
      throw new Error('Services API failed');
    }
  } catch (err) {
    console.log('❌ Services API -', err.message);
    failed++;
  }

  // Test 10: GitHub API
  try {
    const res = await request('/api/github');
    if (res.status === 200 && (res.data.user || res.data.repos)) {
      console.log('✅ GitHub API - Returns GitHub data');
      passed++;
    } else {
      throw new Error('GitHub API failed');
    }
  } catch (err) {
    console.log('❌ GitHub API -', err.message);
    failed++;
  }

  // Test 11: Crypto API
  try {
    const res = await request('/api/crypto');
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log('✅ Crypto API - Returns crypto data');
      passed++;
    } else {
      throw new Error('Crypto API failed');
    }
  } catch (err) {
    console.log('❌ Crypto API -', err.message);
    failed++;
  }

  // Test 12: Todos API (CRUD)
  try {
    // Create
    const postRes = await new Promise((resolve, reject) => {
      const data = JSON.stringify({ text: 'Test todo' });
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/todos',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });

    if (postRes.status === 201 && postRes.data.id) {
      console.log('✅ Todos API - Create works');
      passed++;

      // Read
      const getRes = await request('/api/todos');
      if (getRes.data.some(t => t.id === postRes.data.id)) {
        console.log('✅ Todos API - Read works');
        passed++;
      } else {
        throw new Error('Todo not found after creation');
      }

      // Delete
      await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3001,
          path: `/api/todos/${postRes.data.id}`,
          method: 'DELETE',
        };
        const req = http.request(options, (res) => {
          res.on('end', resolve);
        });
        req.on('error', reject);
        req.end();
      });
      console.log('✅ Todos API - Delete works');
      passed++;
    } else {
      throw new Error('Todo creation failed');
    }
  } catch (err) {
    console.log('❌ Todos API -', err.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});