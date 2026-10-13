// Shared blockchain utilities — safe to import from both client and server components.
// Read-only functions use the public Polygon RPC (no API key needed).
// Write functions live in the API route only (private key stays server-side).

export const CONTRACT_ABI = [
  {
    "type": "event",
    "name": "CertificateIssued",
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "name": "code",     "type": "string"  },
      { "indexed": false, "name": "dataHash",  "type": "bytes32" },
      { "indexed": false, "name": "issuedAt",  "type": "uint256" }
    ]
  },
  {
    "type": "function",
    "name": "issue",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "code",     "type": "string"  },
      { "name": "dataHash", "type": "bytes32" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "verify",
    "stateMutability": "view",
    "inputs":  [{ "name": "code", "type": "string" }],
    "outputs": [
      { "name": "exists",   "type": "bool"    },
      { "name": "dataHash", "type": "bytes32" },
      { "name": "issuedAt", "type": "uint256" }
    ]
  }
] as const;

// Public Polygon RPC — free for read-only calls
const PUBLIC_POLYGON_RPC = 'https://polygon-rpc.com';

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

/** Build the deterministic hash for a certificate's core fields. */
export function buildCertHash(
  code:          string,
  candidateName: string,
  courseName:    string,
  dateIssued:    string
): Promise<string> {
  // Dynamic import keeps ethers out of the initial bundle
  return import('ethers').then(({ ethers }) =>
    ethers.solidityPackedKeccak256(
      ['string', 'string', 'string', 'string'],
      [code, candidateName, courseName, dateIssued]
    )
  );
}

export interface BlockchainVerifyResult {
  status:    'verified' | 'tampered' | 'not_found' | 'error';
  issuedAt?: Date;
  dataHash?: string;
  message?:  string;
}

/**
 * Verify a certificate against the on-chain registry.
 * Compares the stored hash to the expected hash of the supplied data.
 * Completely free — uses a public read-only RPC.
 */
export async function verifyOnChain(
  code:          string,
  candidateName: string,
  courseName:    string,
  dateIssued:    string
): Promise<BlockchainVerifyResult> {
  const contractAddress = CONTRACT_ADDRESS;
  if (!contractAddress) {
    return { status: 'error', message: 'Contract address not configured' };
  }

  try {
    const { ethers } = await import('ethers');
    const provider = new ethers.JsonRpcProvider(PUBLIC_POLYGON_RPC);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    const [exists, onChainHash, issuedAtBN] = await contract.verify(code) as [boolean, string, bigint];

    if (!exists) return { status: 'not_found' };

    const expectedHash = ethers.solidityPackedKeccak256(
      ['string', 'string', 'string', 'string'],
      [code, candidateName, courseName, dateIssued]
    );

    const issuedAt = new Date(Number(issuedAtBN) * 1000);

    if (onChainHash.toLowerCase() === expectedHash.toLowerCase()) {
      return { status: 'verified', issuedAt, dataHash: onChainHash };
    } else {
      return { status: 'tampered', issuedAt, dataHash: onChainHash };
    }
  } catch (err) {
    return { status: 'error', message: (err as Error).message };
  }
}
