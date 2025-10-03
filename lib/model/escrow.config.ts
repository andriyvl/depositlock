
import EscrowArtifacts from '../../artifacts/contracts/Escrow.sol/Escrow.json';

export const escrowABI = EscrowArtifacts.abi;

export const escrowAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
