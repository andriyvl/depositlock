'use server'

import { getSupabaseAdminClient } from '@/lib/supabase/server-client'
import { UserDatabaseContract } from '@/lib/model/agreement.types'
import { revalidatePath } from 'next/cache'

export async function getContracts(userAddress: string): Promise<UserDatabaseContract[]> {
  if (!userAddress) {
    return []
  }

  const supabase = getSupabaseAdminClient()

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

  const supabase = getSupabaseAdminClient()

  const normalizedUserAddress = userAddress.toLowerCase()
  const normalizedContractAddress = contract.contractAddress.toLowerCase()

  const { data: existingContracts, error: existingContractsError } = await supabase
    .from('user_contracts')
    .select('contract_address')
    .eq('user_address', normalizedUserAddress)
    .eq('contract_address', normalizedContractAddress)
    .limit(1)

  if (existingContractsError) {
    console.error('Error checking existing contract:', existingContractsError)
    throw new Error(`Failed to add contract: ${existingContractsError.message}`)
  }

  const operation = existingContracts.length > 0
    ? supabase
        .from('user_contracts')
        .update({
          network_id: contract.networkId,
          role: contract.role,
        })
        .match({
          user_address: normalizedUserAddress,
          contract_address: normalizedContractAddress,
        })
    : supabase
        .from('user_contracts')
        .insert({
          user_address: normalizedUserAddress,
          contract_address: normalizedContractAddress,
          network_id: contract.networkId,
          role: contract.role,
        })

  const { error } = await operation

  if (error) {
    console.error('Error adding contract:', error)
    throw new Error(`Failed to add contract: ${error.message}`)
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

  const supabase = getSupabaseAdminClient()

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
