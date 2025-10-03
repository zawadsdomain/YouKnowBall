// Test script to verify balance validation middleware
// This simulates API calls to test balance validation

async function testBalanceValidation() {
  console.log('🧪 Testing Balance Validation Middleware...\n');

  const baseUrl = 'http://localhost:3000';
  const testTransaction = {
    userId: '46PLws8Vaq01JckRNVOp',
    playerId: '1Asa7Gnbz2Oh1vVVzMLK',
    quantity: 1,
    price: 100
  };

  // Test 1: Valid buy transaction
  console.log('Test 1: Valid buy transaction');
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testTransaction, transactionType: 'buy' })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Buy transaction successful:', data.message);
    } else {
      console.log('❌ Buy transaction failed:', data.message);
    }
  } catch { console.log('❌ Failed to reach server'); }

  // Test 2: Buying with insufficient funds
  console.log('\nTest 2: Buying with insufficient funds');
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...testTransaction, 
        transactionType: 'buy',
        quantity: 1000, // Try to buy 1000 shares at $100 each = $100,000
        price: 100
      })
    });
    const data = await response.json();
    if (data.success === false && data.message === 'Insufficient funds') {
      console.log('✅ Correctly rejected insufficient funds transaction');
      console.log(`   Balance: $${data.balance}, Required: $${data.required}, Shortfall: $${data.shortfall}`);
    } else {
      console.log('❌ Failed to properly validate balance:', data.message);
    }
  } catch { console.log('❌ Failed to reach server'); }

  // Test 3: Selling shares user owns
  console.log('\nTest 3: Selling shares user owns');
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testTransaction, transactionType: 'sell' })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Sell transaction successful:', data.message);
    } else {
      console.log('❌ Sell transaction failed:', data.message);
    }
  } catch { console.log('\n❌ Failed to reach server'); }

  // Test 4: Selling shares user doesn't own
  console.log('\nTest 4: Selling shares user doesn\'t own');
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...testTransaction, 
        playerId: 'nonexistent-player',
        transactionType: 'sell'
      })
    });
    const data = await response.json();
    if (data.success === false && data.message === 'Player not found') {
      console.log('✅ Correctly rejected sale of non-existent player');
    } else if (data.success === false && data.message === 'Cannot sell shares you do not own') {
      console.log('✅ Correctly rejected sale of unowned shares');
    } else {
      console.log('❌ Failed to properly validate ownership:', data.message);
    }
  } catch { console.log('❌ Failed to reach server'); }

  // Test 5: Invalid transaction type
  console.log('\nTest 5: Invalid transaction type');
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...testTransaction, 
        transactionType: 'trade'
      })
    });
    const data = await response.json();
    if (data.success === false && data.message === 'Invalid transaction type') {
      console.log('✅ Correctly rejected invalid transaction type');
    } else {
      console.log('❌ Failed to properly validate transaction type:', data.message);
    }
  } catch { console.log('❌ Failed to reach server'); }

  // Test 6: Missing required fields
  console.log('\nTest 6: Missing required fields');
  try {
    const response = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: testTransaction.userId,
        // Missing: playerId, transactionType, quantity, price
      })
    });
    const data = await response.json();
    if (data.success === false && data.message === 'Missing required fields') {
      console.log('✅ Correctly rejected transaction with missing fields');
      console.log(`   Required fields: ${data.required.join(', ')}`);
    } else {
      console.log('❌ Failed to properly validate required fields:', data.message);
    }
  } catch { console.log('❌ Failed to reach server'); }

  console.log('\n🎉 Balance validation tests completed!');
}

// Run the test (requires server to be running)
console.log('Note: Make sure the server is running on port 3000');
testBalanceValidation().catch(console.error);
