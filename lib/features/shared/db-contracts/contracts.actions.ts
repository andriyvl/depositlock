'use server'

import { supabase } from '@/lib/supabase/server-client'
import { UserDatabaseContract } from '@/lib/model/agreement.types'
import { revalidatePath } from 'next/cache'

export async function getContracts(userAddress: string): Promise<UserDatabaseContract[]> {
  if (!userAddress) {
    return []
  }

  const { data, error } = await supabase
    .from('user_contracts')
    .select('contract_address, role, network_id, created_at')
    .eq('user_address', userAddress.toLowerCase())

  if (error) {
    console.error('Error fetching user contracts:', error)
    return []
  }

  return data.map((c: any) => ({
    contractAddress: c.contract_address,
    role: c.role,
    networkId: c.network_id,
    createdAt: c.created_at,
  }))
}

export async function addContract(
  userAddress: string,
  contract: Omit<UserDatabaseContract, 'createdAt'>
): Promise<void> {
  if (!userAddress) {
    throw new Error('User address is required')
  }

  const { error } = await supabase.from('user_contracts').insert([
    {
      user_address: userAddress.toLowerCase(),
      contract_address: contract.contractAddress,
      network_id: contract.networkId,
      role: contract.role,
    },
  ])

  if (error) {
    console.error('Error adding contract:', error)
    throw new Error('Failed to add contract')
  }

  revalidatePath('/dashboard')
}

export async function removeContract(
  userAddress: string,
  contractAddress: string
): Promise<void> {
  if (!userAddress) {
    throw new Error('User address is required')
  }

  const { error } = await supabase
    .from('user_contracts')
    .delete()
    .match({
      user_address: userAddress.toLowerCase(),
      contract_address: contractAddress.toLowerCase(),
    })

  if (error) {
    console.error('Error removing contract:', error)
    throw new Error('Failed to remove contract')
  }
  revalidatePath('/dashboard')
}