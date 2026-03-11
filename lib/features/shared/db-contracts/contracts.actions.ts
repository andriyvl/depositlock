"use server";

import { getPostgresClient } from "@/lib/database/postgres.service";
import {
  type UserDatabaseContract,
  type UserContractRole,
} from "@/lib/model/agreement.types";
import { type SupportedNetworkIds } from "@/lib/model/network.config";
import { revalidatePath } from "next/cache";

interface UserContractRow {
  contract_address: string;
  role: UserContractRole;
  network_id: SupportedNetworkIds;
  created_at: string | Date;
}

function mapUserContract(row: UserContractRow): UserDatabaseContract {
  return {
    contractAddress: row.contract_address,
    role: row.role,
    networkId: row.network_id,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown database error";
}

export async function getContracts(
  userAddress: string,
): Promise<UserDatabaseContract[]> {
  if (!userAddress) {
    return [];
  }

  const sql = getPostgresClient();

  try {
    const data = await sql<UserContractRow[]>`
      select contract_address, role, network_id, created_at
      from public.user_contracts
      where user_address = ${userAddress.toLowerCase()}
      order by created_at desc, contract_address asc
    `;

    return data.map(mapUserContract);
  } catch (error) {
    console.error("Error fetching user contracts:", error);
    return [];
  }
}

export async function addContract(
  userAddress: string,
  contract: Omit<UserDatabaseContract, "createdAt">,
): Promise<void> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  const sql = getPostgresClient();

  const normalizedUserAddress = userAddress.toLowerCase();
  const normalizedContractAddress = contract.contractAddress.toLowerCase();

  try {
    await sql`
      insert into public.user_contracts (
        user_address,
        contract_address,
        network_id,
        role
      )
      values (
        ${normalizedUserAddress},
        ${normalizedContractAddress},
        ${contract.networkId},
        ${contract.role}
      )
      on conflict (user_address, contract_address)
      do update set
        network_id = excluded.network_id,
        role = excluded.role
    `;
  } catch (error) {
    console.error("Error adding contract:", error);
    throw new Error(`Failed to add contract: ${getErrorMessage(error)}`);
  }

  revalidatePath("/dashboard");
}

export async function removeContract(
  userAddress: string,
  contractAddress: string,
): Promise<void> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  const sql = getPostgresClient();

  try {
    await sql`
      delete from public.user_contracts
      where user_address = ${userAddress.toLowerCase()}
        and contract_address = ${contractAddress.toLowerCase()}
    `;
  } catch (error) {
    console.error("Error removing contract:", error);
    throw new Error(`Failed to remove contract: ${getErrorMessage(error)}`);
  }

  revalidatePath("/dashboard");
}
