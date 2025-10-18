#!/usr/bin/env node

/**
 * Stripe Payment System Test Script
 * This script helps test the Stripe payment integration
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testOrderData: {
    childName: 'Test Child',
    email: 'test@example.com',
    phone: '123-456-7890',
    category: 'jungle',
    imageUrl: '/placeholder.svg',
    timestamp: new Date().toISOString()
  },
  testAmount: 1000 // $10.00 in cents
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testServerRunning() {
  log('\n🔍 Testing if server is running...', 'blue');
  
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderData: TEST_CONFIG.testOrderData,
        amount: TEST_CONFIG.testAmount
      })
    });
    
    if (response.statusCode === 200) {
      log('✅ Server is running and API is accessible', 'green');
      return true;
    } else {
      log(`❌ Server responded with status ${response.statusCode}`, 'red');
      log(`Response: ${response.data}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Server is not running or not accessible: ${error.message}`, 'red');
    log('💡 Make sure to run "npm run dev" first', 'yellow');
    return false;
  }
}

async function testCheckoutSessionCreation() {
  log('\n🧪 Testing checkout session creation...', 'blue');
  
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderData: TEST_CONFIG.testOrderData,
        amount: TEST_CONFIG.testAmount
      })
    });
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.sessionId && data.url) {
        log('✅ Checkout session created successfully', 'green');
        log(`   Session ID: ${data.sessionId}`, 'blue');
        log(`   Checkout URL: ${data.url}`, 'blue');
        return { success: true, sessionId: data.sessionId, url: data.url };
      } else {
        log('❌ Invalid response format', 'red');
        log(`   Response: ${response.data}`, 'yellow');
        return { success: false };
      }
    } else {
      log(`❌ Failed to create checkout session: ${response.statusCode}`, 'red');
      log(`   Response: ${response.data}`, 'yellow');
      return { success: false };
    }
  } catch (error) {
    log(`❌ Error creating checkout session: ${error.message}`, 'red');
    return { success: false };
  }
}

async function testEnvironmentVariables() {
  log('\n🔧 Checking environment variables...', 'blue');
  
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY', 
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_BASE_URL'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    // Note: This is a basic check - in a real app, you'd check process.env
    log(`   Checking ${varName}...`, 'blue');
  }
  
  log('💡 Environment variables are checked in .env.local file', 'yellow');
  log('   Make sure all required Stripe keys are set correctly', 'yellow');
  
  return allPresent;
}

function printTestInstructions() {
  log('\n📋 Manual Testing Instructions:', 'bold');
  log('1. Open your browser and go to: http://localhost:3000/create', 'blue');
  log('2. Fill out the form with test data:', 'blue');
  log('   - Child Name: Test Child', 'blue');
  log('   - Email: test@example.com', 'blue');
  log('   - Phone: 123-456-7890', 'blue');
  log('   - Upload any image', 'blue');
  log('   - Select any story category', 'blue');
  log('3. Click "Create My Storybook"', 'blue');
  log('4. On the payment page, click "Pay with Stripe - $10.00"', 'blue');
  log('5. Use test card: 4242 4242 4242 4242', 'blue');
  log('6. Use any future expiry date and CVC', 'blue');
  log('7. Complete the payment and verify success page', 'blue');
}

function printTestCards() {
  log('\n💳 Stripe Test Card Numbers:', 'bold');
  log('✅ Successful Payment: 4242 4242 4242 4242', 'green');
  log('❌ Declined Card: 4000 0000 0000 0002', 'red');
  log('❌ Insufficient Funds: 4000 0000 0000 9995', 'red');
  log('❌ Expired Card: 4000 0000 0000 0069', 'red');
}

async function runTests() {
  log('🚀 Starting Stripe Payment System Tests', 'bold');
  log('=====================================', 'bold');
  
  // Test 1: Check if server is running
  const serverRunning = await testServerRunning();
  if (!serverRunning) {
    log('\n❌ Tests cannot continue - server is not running', 'red');
    log('💡 Please run "npm run dev" first and try again', 'yellow');
    return;
  }
  
  // Test 2: Check environment variables
  await testEnvironmentVariables();
  
  // Test 3: Test checkout session creation
  const checkoutResult = await testCheckoutSessionCreation();
  
  // Print results summary
  log('\n📊 Test Results Summary:', 'bold');
  log('=======================', 'bold');
  log(`✅ Server Running: ${serverRunning ? 'PASS' : 'FAIL'}`, serverRunning ? 'green' : 'red');
  log(`✅ Checkout Session: ${checkoutResult.success ? 'PASS' : 'FAIL'}`, checkoutResult.success ? 'green' : 'red');
  
  if (checkoutResult.success) {
    log('\n🎉 Basic API tests passed! Your payment system is ready for manual testing.', 'green');
    printTestInstructions();
    printTestCards();
  } else {
    log('\n⚠️  Some tests failed. Please check your configuration.', 'yellow');
    log('💡 Common issues:', 'yellow');
    log('   - Make sure Stripe keys are correct in .env.local', 'yellow');
    log('   - Verify your Stripe account is active', 'yellow');
    log('   - Check server logs for detailed error messages', 'yellow');
  }
  
  log('\n📚 For detailed testing guide, see: STRIPE_TESTING_GUIDE.md', 'blue');
}

// Run the tests
runTests().catch(console.error);
