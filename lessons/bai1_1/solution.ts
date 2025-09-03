import crypto from "crypto";

export type Block = {
  index: number;
  timestamp: string;
  transactions: any[];
  previous_hash: string;
  current_hash: string;
};

// ✍️ TODO: Viết hàm tại đây
export function isValidBlock(block: Block): boolean {
  // Check if the block is valid by hashing (SHA256) the index, timestamp, transactions, and previous_hash
  const hash = crypto.createHash("sha256")
    .update(block.index + block.timestamp + JSON.stringify(block.transactions) + block.previous_hash)
    .digest("hex");
  return hash === block.current_hash;
}
