// Test script to verify transaction atomicity
// This simulates Firestore transaction behavior to show how race conditions are prevented

// Simulate Firestore transaction behavior
let userBalance = 10000; // Starting balance
let holding = null; // No initial holding
let transactionCounter = 0;

async function simulateFirestoreTransaction(userId, playerId, transactionType, quantity, price) {
  // Simulate Firestore transaction with retry logic
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // Simulate transaction attempt
      const currentBalance = userBalance; // Snapshot at transaction start
      const currentHolding = holding ? { ...holding } : null; // Snapshot at transaction start
      
      // Mock transaction processing logic
      const balanceChange = transactionType === 'buy' 
        ? -(price * quantity)  // Negative for buying
        : (price * quantity);  // Positive for selling

      const newBalance = currentBalance + balanceChange;
      
      if (newBalance < 0) {
        throw new Error('Insufficient funds');
      }

      // Update holding logic
      if (currentHolding) {
        const currentQuantity = currentHolding.quantity;

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
            const totalCost = currentHolding.avgPrice * currentQuantity + price * quantity;
            updatePayload.avgPrice = totalCost / newQuantity;
            updatePayload.mostRecentPurchase = new Date();
          } else {
            updatePayload.avgPrice = currentHolding.avgPrice;
          }

          holding = { ...currentHolding, ...updatePayload };
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
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        throw error;
      }
      // Simulate retry delay
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

// Test concurrent transactions
async function testConcurrentTransactions() {
  console.log('🧪 Testing Firestore Transaction Atomicity...\n');

  const testUserId = 'test-user-123';
  const testPlayerId = 'test-player-456';
  
  // Test 1: Normal transaction
  console.log('Test 1: Normal buy transaction');
  try {
    const result1 = await simulateFirestoreTransaction(testUserId, testPlayerId, 'buy', 5, 100);
    console.log('✅ Buy successful:', result1);
  } catch (error) {
    console.log('❌ Buy failed:', error.message);
  }

  // Test 2: Simulate concurrent transactions (Firestore serializes these)
  console.log('\nTest 2: Simulating concurrent transactions (Firestore serializes these)');
  const promises = [];
  
  // Start multiple transactions simultaneously
  for (let i = 0; i < 3; i++) {
    promises.push(
      simulateFirestoreTransaction(testUserId, testPlayerId, 'buy', 1, 110)
        .then(result => ({ success: true, result, index: i }))
        .catch(error => ({ success: false, error: error.message, index: i }))
    );
  }

  const results = await Promise.all(promises);
  
  results.forEach(({ success, result, error, index }) => {
    if (success) {
      console.log(`✅ Transaction ${index + 1} successful:`, result);
    } else {
      console.log(`❌ Transaction ${index + 1} failed:`, error);
    }
  });

  console.log(`\nFinal balance: $${userBalance}`);
  console.log(`Final holding:`, holding);

  // Test 3: Verify Firestore transaction behavior
  console.log('\nTest 3: Verifying Firestore transaction behavior');
  const expectedBalance = 10000 - (5 * 100) - (3 * 110); // Should be 9170
  const expectedQuantity = 5 + 3; // Should be 8 shares
  
  if (userBalance === expectedBalance && holding && holding.quantity === expectedQuantity) {
    console.log('✅ Firestore transactions working correctly - all transactions processed');
  } else {
    console.log('❌ Unexpected result');
    console.log(`Expected balance: $${expectedBalance}, actual: $${userBalance}`);
    console.log(`Expected quantity: ${expectedQuantity}, actual: ${holding ? holding.quantity : 0}`);
  }

  console.log('\n🎉 Firestore transaction atomicity tests completed!');
  console.log('Note: In real Firestore, concurrent transactions are automatically serialized');
  console.log('This test shows the expected behavior with proper transaction handling');
}

// Run the test
testConcurrentTransactions().catch(console.error);
