// ─────────────────────────────────────────────────────────────
// Deploy MetabridgeCertificateRegistry to Polygon PoS
//
// Prerequisites:
//   1. Fill in .env.local:
//        POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
//        DEPLOYER_PRIVATE_KEY=0x...
//   2. Run:  node scripts/deploy.js
//   3. Copy the printed contract address into .env.local:
//        NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
// ─────────────────────────────────────────────────────────────

require('dotenv').config({ path: '.env.local' });
const { ethers } = require('ethers');
const artifact   = require('../build/CertificateRegistry.json');

async function main() {
  const rpcUrl    = process.env.POLYGON_RPC_URL;
  const privKey   = process.env.DEPLOYER_PRIVATE_KEY;

  if (!rpcUrl || !privKey) {
    console.error('❌  Set POLYGON_RPC_URL and DEPLOYER_PRIVATE_KEY in .env.local first.');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet   = new ethers.Wallet(privKey, provider);

  const balance = ethers.formatEther(await provider.getBalance(wallet.address));
  console.log(`\n📡 Network: Polygon PoS`);
  console.log(`👛 Deployer: ${wallet.address}`);
  console.log(`💰 Balance: ${balance} MATIC`);

  if (parseFloat(balance) < 0.01) {
    console.error('❌  Balance too low — need at least 0.01 MATIC for deployment gas.');
    process.exit(1);
  }

  console.log('\n🚀 Deploying MetabridgeCertificateRegistry...');
  const factory  = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();

  console.log(`   Tx hash: ${contract.deploymentTransaction().hash}`);
  console.log('   Waiting for confirmation...');
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\n✅ Contract deployed!`);
  console.log(`   Address: ${address}`);
  console.log(`   Polygonscan: https://polygonscan.com/address/${address}`);
  console.log('\n📋 Add this to your .env.local:');
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch(err => {
  console.error('Deployment failed:', err.message);
  process.exit(1);
});
