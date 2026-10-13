// Run: node scripts/compile.js
// Compiles contracts/CertificateRegistry.sol → build/CertificateRegistry.json

const solc = require('solc');
const fs   = require('fs');
const path = require('path');

const source = fs.readFileSync(
  path.join(__dirname, '../contracts/CertificateRegistry.sol'),
  'utf8'
);

const input = {
  language: 'Solidity',
  sources: { 'CertificateRegistry.sol': { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const errs = output.errors.filter(e => e.severity === 'error');
  if (errs.length) {
    console.error('Compilation errors:');
    errs.forEach(e => console.error(e.formattedMessage));
    process.exit(1);
  }
}

const contract = output.contracts['CertificateRegistry.sol']['MetabridgeCertificateRegistry'];
const artifact = {
  abi:      contract.abi,
  bytecode: '0x' + contract.evm.bytecode.object,
};

fs.mkdirSync(path.join(__dirname, '../build'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, '../build/CertificateRegistry.json'),
  JSON.stringify(artifact, null, 2)
);
console.log('✅ Compiled → build/CertificateRegistry.json');
console.log('   ABI functions:', artifact.abi.filter(x => x.type === 'function').map(x => x.name).join(', '));
