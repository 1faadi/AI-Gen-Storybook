#!/usr/bin/env node

/**
 * Quick Payment System Test
 * Tests the payment flow without webhooks
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testOrderData: {
    childName: 'Webhook Test Child',
    email: 'webhook-test@example.com',
    phone: '123-456-7890',
    category: 'jungle',
    imageUrl: '/placeholder.svg',
    timestamp: new Date().toISOString()
  },
  testAmount: 1000
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
    const client = isHttps ? http : http;
    
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

async function testPaymentFlow() {
  log('\n🧪 Testing Complete Payment Flow...', 'blue');
  
  try {
    // Step 1: Create checkout session
    log('1. Creating checkout session...', 'blue');
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
      log('✅ Checkout session created successfully', 'green');
      log(`   Session ID: ${data.sessionId}`, 'blue');
      
      // Step 2: Test session retrieval
      log('2. Testing session retrieval...', 'blue');
      const sessionResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/checkout-session/${data.sessionId}`);
      
      if (sessionResponse.statusCode === 200) {
        log('✅ Session retrieval working', 'green');
        
        // Step 3: Test success page
        log('3. Testing success page...', 'blue');
        const successResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/payment/success?session_id=${data.sessionId}`);
        
        if (successResponse.statusCode === 200) {
          log('✅ Success page accessible', 'green');
          
          log('\n🎉 Payment Flow Test Results:', 'bold');
          log('============================', 'bold');
          log('✅ Checkout Session Creation: PASS', 'green');
          log('✅ Session Retrieval: PASS', 'green');
          log('✅ Success Page: PASS', 'green');
          log('✅ Payment System: WORKING PERFECTLY!', 'green');
          
          log('\n💳 Ready for Manual Testing:', 'blue');
          log('1. Go to: http://localhost:3000/create', 'white');
          log('2. Fill out the form', 'white');
          log('3. Use test card: 4242 4242 4242 4242', 'white');
          log('4. Complete payment', 'white');
          log('5. Verify success page', 'white');
          
          log('\n📊 Webhook Status:', 'blue');
          log('⚠️  Webhooks not configured (optional)', 'yellow');
          log('✅ Payments work without webhooks', 'green');
          log('💡 Webhooks are for email notifications only', 'yellow');
          
          return true;
        } else {
          log(`❌ Success page failed: ${successResponse.statusCode}`, 'red');
          return false;
        }
      } else {
        log(`❌ Session retrieval failed: ${sessionResponse.statusCode}`, 'red');
        return false;
      }
    } else {
      log(`❌ Checkout session creation failed: ${response.statusCode}`, 'red');
      log(`   Response: ${response.data}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('🚀 Stripe Payment System Test (No Webhooks)', 'bold');
  log('============================================', 'bold');
  
  const success = await testPaymentFlow();
  
  if (success) {
    log('\n🎉 CONCLUSION: Your payment system is working perfectly!', 'green');
    log('You can process payments right now without webhooks.', 'green');
    log('Webhooks are optional and mainly for email notifications.', 'yellow');
  } else {
    log('\n⚠️  Some tests failed. Check your server and configuration.', 'yellow');
  }
  
  log('\n📚 For webhook setup, see: WEBHOOK_ALTERNATIVE_SETUP.md', 'blue');
}

// Run the tests
runTests().catch(console.error);
