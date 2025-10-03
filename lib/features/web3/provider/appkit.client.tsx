"use client";

import { ethers } from 'ethers'

export const AMOY_RPC_URL = process.env.NEXT_PUBLIC_RPC_AMOY || 'https://rpc-amoy.polygon.technology/'

// Read-only provider fallback (no wallet connected)
export function getReadonlyProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(AMOY_RPC_URL)
}
