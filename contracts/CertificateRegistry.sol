// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MetabridgeCertificateRegistry
 * @notice Permanent on-chain registry of Metabridge Academy certificates.
 *         Each certificate is stored as a keccak256 hash of its core fields
 *         so any tampering with the certificate data is detectable.
 */
contract MetabridgeCertificateRegistry {
    address public owner;

    struct CertRecord {
        bytes32 dataHash;   // keccak256(abi.encodePacked(code, candidateName, courseName, dateIssued))
        uint256 issuedAt;   // block.timestamp at issuance
        bool    exists;
    }

    mapping(string => CertRecord) private _registry;

    event CertificateIssued(
        string  indexed code,
        bytes32         dataHash,
        uint256         issuedAt
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Record a certificate on-chain. Can only be called by the owner.
     * @param code      The certificate code, e.g. "MA/C1/26/00001"
     * @param dataHash  keccak256 of (code, candidateName, courseName, dateIssued)
     */
    function issue(string calldata code, bytes32 dataHash) external onlyOwner {
        require(bytes(code).length > 0, "Empty code");
        require(!_registry[code].exists, "Already issued");
        _registry[code] = CertRecord({
            dataHash: dataHash,
            issuedAt: block.timestamp,
            exists:   true
        });
        emit CertificateIssued(code, dataHash, block.timestamp);
    }

    /**
     * @notice Verify a certificate. Free read — no gas needed by callers.
     * @return exists    Whether this code was ever issued
     * @return dataHash  The hash recorded at issuance
     * @return issuedAt  Unix timestamp of the issuing block
     */
    function verify(string calldata code) external view returns (
        bool    exists,
        bytes32 dataHash,
        uint256 issuedAt
    ) {
        CertRecord memory r = _registry[code];
        return (r.exists, r.dataHash, r.issuedAt);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}
