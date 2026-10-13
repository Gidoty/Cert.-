import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  const { code, candidateName, courseName, dateIssued } = await req.json();

  const rpcUrl          = process.env.POLYGON_RPC_URL;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    return NextResponse.json({ status: 'error', message: 'Not configured' }, { status: 503 });
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    const [exists, onChainHash, issuedAtBN] = await contract.verify(code) as [boolean, string, bigint];

    if (!exists) {
      return NextResponse.json({ status: 'not_found' });
    }

    const expectedHash = ethers.solidityPackedKeccak256(
      ['string', 'string', 'string', 'string'],
      [code, candidateName, courseName, dateIssued]
    );

    const issuedAt = new Date(Number(issuedAtBN) * 1000).toUTCString();

    if (onChainHash.toLowerCase() === expectedHash.toLowerCase()) {
      return NextResponse.json({ status: 'verified', issuedAt, dataHash: onChainHash });
    } else {
      return NextResponse.json({ status: 'tampered', issuedAt, dataHash: onChainHash });
    }
  } catch (err) {
    return NextResponse.json({ status: 'error', message: (err as Error).message }, { status: 500 });
  }
}
