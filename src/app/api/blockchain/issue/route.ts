// POST /api/blockchain/issue
// Server-only — private key never reaches the browser.

import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  const { code, candidateName, courseName, dateIssued } = await req.json();

  if (!code || !candidateName || !courseName || !dateIssued) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const rpcUrl          = process.env.POLYGON_RPC_URL;
  const privateKey      = process.env.DEPLOYER_PRIVATE_KEY;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    return NextResponse.json(
      { error: 'Blockchain not configured — set POLYGON_RPC_URL, DEPLOYER_PRIVATE_KEY, NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local' },
      { status: 503 }
    );
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet   = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);

    // Build deterministic hash from certificate fields
    const dataHash = ethers.solidityPackedKeccak256(
      ['string', 'string', 'string', 'string'],
      [code, candidateName, courseName, dateIssued]
    );

    const tx = await contract.issue(code, dataHash);
    const receipt = await tx.wait(1); // wait for 1 confirmation

    return NextResponse.json({
      txHash:      receipt.hash,
      blockNumber: receipt.blockNumber,
      dataHash,
      polygonscan: `https://polygonscan.com/tx/${receipt.hash}`,
    });
  } catch (err) {
    const message = (err as Error).message ?? 'Unknown error';
    // "Already issued" from the contract — certificate exists on-chain already
    if (message.includes('Already issued')) {
      return NextResponse.json({ error: 'already_issued' }, { status: 409 });
    }
    console.error('[blockchain/issue]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
