// Test script for transaction service logic
// This simulates the transaction processing without actual database calls

// Test transaction service logic
async function testTransactionService() {
  console.log('🧪 Testing Transaction Service...\n');

  // Mock data
  const testUserId = 'test-user-123';
  const testPlayerId = 'test-player-456';
  
  // Test 1: Buy transaction (new holding)
  console.log('Test 1: Buy 5 shares at $100 each');
  try {
    const result1 = await simulateTransaction(testUserId, testPlayerId, 'buy', 5, 100);
    console.log('✅ Buy successful:', result1);
  } catch (error) {
    console.log('❌ Buy failed:', error.message);
  }

  // Test 2: Buy more shares (existing holding)
  console.log('\nTest 2: Buy 3 more shares at $120 each');
  try {
    const result2 = await simulateTransaction(testUserId, testPlayerId, 'buy', 3, 120);
    console.log('✅ Buy more successful:', result2);
  } catch (error) {
    console.log('❌ Buy more failed:', error.message);
  }

  // Test 3: Sell some shares
  console.log('\nTest 3: Sell 2 shares at $110 each');
  try {
    const result3 = await simulateTransaction(testUserId, testPlayerId, 'sell', 2, 110);
    console.log('✅ Sell successful:', result3);
  } catch (error) {
    console.log('❌ Sell failed:', error.message);
  }

  // Test 4: Sell all remaining shares (should delete holding)
  console.log('\nTest 4: Sell all remaining shares at $130 each');
  try {
    const result4 = await simulateTransaction(testUserId, testPlayerId, 'sell', 6, 130);
    console.log('✅ Sell all successful:', result4);
  } catch (error) {
    console.log('❌ Sell all failed:', error.message);
  }

  // Test 5: Try to sell when no holding exists
  console.log('\nTest 5: Try to sell when no holding exists');
  try {
    const result5 = await simulateTransaction(testUserId, testPlayerId, 'sell', 1, 100);
    console.log('❌ This should have failed but didn\'t:', result5);
  } catch (error) {
    console.log('✅ Correctly failed:', error.message);
  }

  // Test 6: Try to buy with insufficient funds
  console.log('\nTest 6: Try to buy with insufficient funds');
  try {
    const result6 = await simulateTransaction(testUserId, testPlayerId, 'buy', 1000, 100);
    console.log('❌ This should have failed but didn\'t:', result6);
  } catch (error) {
    console.log('✅ Correctly failed:', error.message);
  }

  console.log('\n🎉 Transaction service tests completed!');
}

// Simulate transaction logic (without actual database calls)
let userBalance = 10000; // Starting balance
let holding = null; // No initial holding

async function simulateTransaction(userId, playerId, transactionType, quantity, price) {
  // Mock transaction processing logic
  const balanceChange = transactionType === 'buy' 
    ? -(price * quantity)  // Negative for buying
    : (price * quantity);  // Positive for selling

  const newBalance = userBalance + balanceChange;
  
  if (newBalance < 0) {
    throw new Error('Insufficient funds');
  }

  // Update holding logic
  if (holding) {
    const currentQuantity = holding.quantity;

    if (transactionType === 'sell' && currentQuantity < quantity) {
      throw new Error('Insufficient shares to sell');
    }

    const isBuy = transactionType === 'buy';
    const newQuantity = isBuy
      ? currentQuantity + quantity
      : currentQuantity - quantity;

    if (newQuantity < 0) {
      throw new Error('Holdings cannot be negative');
    }

    if (newQuantity === 0) {
      holding = null; // Delete holding
      console.log('  📝 Holding deleted (quantity reached 0)');
    } else {
      const updatePayload = {
        quantity: newQuantity,
        updatedAt: new Date()
      };

      if (isBuy) {
        const totalCost = holding.avgPrice * currentQuantity + price * quantity;
        updatePayload.avgPrice = totalCost / newQuantity;
        updatePayload.mostRecentPurchase = new Date();
      } else {
        updatePayload.avgPrice = holding.avgPrice;
      }

      holding = { ...holding, ...updatePayload };
      console.log(`  📝 Holding updated: ${newQuantity} shares at avg $${updatePayload.avgPrice.toFixed(2)}`);
    }
  } else {
    if (transactionType === 'sell') {
      throw new Error('Cannot sell shares you do not own');
    }

    holding = {
      userId,
      playerId,
      quantity,
      avgPrice: price,
      mostRecentPurchase: new Date(),
      updatedAt: new Date()
    };
    console.log(`  📝 New holding created: ${quantity} shares at $${price}`);
  }

  // Update user balance
  userBalance = newBalance;
  console.log(`  💰 Balance updated: $${userBalance}`);

  return {
    transactionId: `txn-${Date.now()}`,
    newBalance,
    holdingId: holding ? `${userId}_${playerId}` : null,
    holding
  };
}

// Run the test
testTransactionService().catch(console.error);
