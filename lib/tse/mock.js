/**
 * Mock TSE implementation for development.
 * Returns fake transactionId, signature, and timestamp without real API credentials.
 */

export function mockSignTransaction(payload) {
  const now = new Date();
  const txId = `MOCK-TX-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const signature = `MOCK-SIG-${Buffer.from(JSON.stringify({ txId, payload, ts: now.toISOString() })).toString("base64").slice(0, 64)}`;
  return {
    transactionId: txId,
    signature,
    timestamp: now.toISOString(),
    provider: "mock",
  };
}
