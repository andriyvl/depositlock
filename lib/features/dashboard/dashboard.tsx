"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../auth/auth.hook";
import { useAgreements } from "../shared/agreements.hook";
import { addContract as addContractAction } from '../shared/db-contracts/contracts.actions';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedBadge } from "@/lib/features/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Plus, Eye, Shield, Calendar, Users, Filter, Loader2, AlertCircle, PlusCircle, Copy, X } from "lucide-react";
import { formatDateShort, getDaysUntilDeadline } from "@/lib/helpers/date.helpers";

import { verifyUserRole, copyContractAddress } from "@/lib/helpers/contract.helpers";
import { AgreementStatus, AgreementStatusName } from "@/lib/model/agreement.types";
import { DEPLOYMENT_NETWORKS, getNetworkDisplayName, SupportedNetworkIds } from "@/lib/model/network.config";
import { StatusWidgets } from "./components/status-widgets";


export function Dashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [showAddContract, setShowAddContract] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [addContractNetworkId, setAddContractNetworkId] = useState<SupportedNetworkIds>(SupportedNetworkIds.polygon);

  const [validationMessage, setValidationMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgreementStatusName | "all">("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);


  const [verifying, setVerifying] = useState(false);

  const { user, isAuthenticated, login, isAuthLoading } = useAuth();
  const { agreements, loading, error, fetchAgreements } = useAgreements({ user });

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  useEffect(() => {
    if (user?.networkId) {
      setAddContractNetworkId(user.networkId);
    }
  }, [user?.networkId]);

  const handleAddContract = async () => {
    if (!contractAddress.trim()) {
      setValidationMessage("❌ Please enter a contract address");
      return;
    }

    if (!user?.address) {
      setValidationMessage("❌ Please connect your wallet first");
      return;
    }

    if (agreements.find(a => a.contractAddress.toLowerCase() === contractAddress.trim().toLowerCase())) {
      setValidationMessage("❌ Contract already exists");
      return;
    }

    setVerifying(true);
    setValidationMessage("🔍 Verifying contract...");

    try {
      const networkId = addContractNetworkId;
      const role = await verifyUserRole(contractAddress.trim(), user.address, networkId);

      if (role) {
        await addContractAction(user.address, {
          contractAddress: contractAddress.trim().toLowerCase(),
          role,
          networkId,
        });

        setValidationMessage(`✅ Contract added as ${role}!`);
        setContractAddress("");
        fetchAgreements();

        setTimeout(() => {
          setShowAddContract(false);
          setValidationMessage("");
        }, 1500);
      } else {
        setValidationMessage("❌ You are not the creator or depositor of this contract");
      }
    } catch (error: any) {
      setValidationMessage(`❌ ${error.message}`);
    } finally {
      setVerifying(false);
    }
  };


  const handleCopyContractAddress = async (contractAddress: string) => {
    await copyContractAddress(contractAddress);
  };

  const handleCopyCounterpartyAddress = async (counterparty: string) => {
    if (counterparty && counterparty !== 'No depositor yet') {
      await copyContractAddress(counterparty);
    }
  };

  const stats = useMemo(() => ({
    total: agreements.length,
    filled: agreements.filter(a => a.statusName === 'filled').length,
    released: agreements.filter(a => a.statusName === 'released').length,
    pending: agreements.filter(a => a.statusName === 'pending').length,
    cancelled: agreements.filter(a => a.statusName === 'canceled').length,
    disputed: agreements.filter(a => a.statusName === 'disputed').length,
  }), [agreements]);

  const filteredAgreements = agreements.filter(a => {
    const roleMatch = activeTab === 'all' || a.role === activeTab;
    const statusMatch = statusFilter === 'all' || a.statusName === statusFilter;
    const networkMatch = networkFilter === 'all' || a.networkName === networkFilter;
    return roleMatch && statusMatch && networkMatch;
  });

  const uniqueNetworks = [...new Set(agreements.map(a => a.networkName))];
  const uniqueStatuses = [...new Set(agreements.map(a => a.statusName))];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-display text-3xl tracking-[-0.05em] text-foreground">Connect your wallet</h3>
            <p className="mt-3 text-center text-muted-foreground">
              Connect your wallet to view and manage your deposit agreements
            </p>
            <Button
              onClick={login}
              disabled={isAuthLoading}
              className="mt-6"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="mb-4 h-8 w-8 text-destructive-500" />
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container py-6 sm:py-10">
        <div className="mb-8 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_0.95fr]">
          <Card className="overflow-hidden border-0 bg-secondary text-secondary-foreground">
            <CardContent className="p-6 sm:p-7 lg:p-8">
              <Badge className="border-white/16 bg-white/10 text-white" variant="outline" size="m">
                Dashboard
              </Badge>
              <h1 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-black leading-[0.92] tracking-[-0.075em] text-white">
                Track every rental deposit in one place.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Review creator and depositor contracts, filter by network or status, and jump directly
                into the agreement you need to manage.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" className="border-white/16 bg-white/10 text-white hover:bg-white/16" onClick={() => setShowAddContract(!showAddContract)}>
                  <PlusCircle className="h-4 w-4" />
                  {showAddContract ? "Close importer" : "Add existing contract"}
                </Button>
                <Button variant="gradientPrimarySecondary" asChild>
                  <Link href="/creator">
                    <Plus className="h-4 w-4" />
                    Create agreement
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/86">
            <CardContent className="grid gap-5 p-6 sm:p-7 lg:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-700">Current summary</p>
                <h2 className="mt-3 font-display text-3xl font-black tracking-[-0.06em] text-foreground">
                  {stats.total} agreements discovered
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-primary-50 px-5 py-4">
                  <p className="text-sm font-medium text-secondary-800">Open to action</p>
                  <p className="mt-2 text-3xl font-display font-black tracking-[-0.05em] text-foreground">{stats.pending + stats.filled}</p>
                </div>
                <div className="rounded-[1.5rem] bg-muted/70 px-5 py-4">
                  <p className="text-sm font-medium text-secondary-800">Resolved</p>
                  <p className="mt-2 text-3xl font-display font-black tracking-[-0.05em] text-foreground">{stats.released + stats.cancelled}</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Contracts added manually are verified against your wallet role before they appear in the dashboard.
              </p>
            </CardContent>
          </Card>
        </div>

        <StatusWidgets stats={stats} />

        {showAddContract && (
          <Card className="mb-6 bg-white/86">
            <CardContent className="p-6 sm:p-7">
              <h3 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground">Add existing contract</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contract Address</label>
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                    className="h-12 w-full rounded-2xl border border-input bg-white/90 px-4 py-3 text-sm font-medium text-foreground shadow-xs transition-[border-color,box-shadow] focus:outline-hidden focus:ring-2 focus:ring-ring/40 focus:ring-offset-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Network</label>
                  <Select
                    value={addContractNetworkId}
                    onValueChange={(value) => setAddContractNetworkId(value as SupportedNetworkIds)}
                  >
                    <SelectTrigger className="rounded-2xl border-input bg-white/90 text-sm font-medium">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPLOYMENT_NETWORKS.map((networkId) => (
                        <SelectItem key={networkId} value={networkId}>
                          {getNetworkDisplayName(networkId)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {validationMessage && (
                  <div className={`rounded-[1.5rem] border p-4 text-sm ${validationMessage.includes('✅')
                    ? 'border-primary-200 bg-primary-100 text-secondary-800'
                    : validationMessage.includes('❌')
                      ? 'border-destructive-200 bg-destructive-100 text-destructive-800'
                      : 'border-tertiary-200 bg-tertiary-100 text-secondary-800'
                    }`}>
                    {validationMessage}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={handleAddContract}
                    disabled={!contractAddress.trim() || verifying}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Add Contract'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddContract(false);
                    setValidationMessage("");
                    setContractAddress("");
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Enter a contract address and we'll verify your role (creator or depositor) and add it to your dashboard.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/86">
          <CardHeader className="p-6 pb-0 sm:p-7 sm:pb-0">
            <div>
              <CardTitle className="text-[clamp(2.2rem,4vw,3.2rem)] font-black tracking-[-0.06em]">Your agreements</CardTitle>
              <CardDescription className="mt-2 text-base leading-7">
                View and manage every deposit agreement connected to your wallet.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-7">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <TabsList className="grid w-full grid-cols-1 gap-1 sm:grid-cols-3 xl:max-w-[44rem]">
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="creator">As Creator ({agreements.filter(a => a.role === 'creator').length})</TabsTrigger>
                  <TabsTrigger value="depositor">As Depositor ({agreements.filter(a => a.role === 'depositor').length})</TabsTrigger>
                </TabsList>

                <Button
                  variant="outline"
                  size="sm"
                  className="xl:shrink-0"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>

              {showFilters && (
                <div className="mt-5 rounded-[1.75rem] border border-border/70 bg-muted/60 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Filter Options</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all");
                        setNetworkFilter("all");
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Status</label>
                      <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AgreementStatusName)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {uniqueStatuses.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Network</label>
                      <Select value={networkFilter} onValueChange={setNetworkFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Networks" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Networks</SelectItem>
                          {uniqueNetworks.map(network => (
                            <SelectItem key={network} value={network}>
                              {network.charAt(0).toUpperCase() + network.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {loading && (
                    <div className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4 mx-auto" />
                      <p className="text-muted-foreground">Loading your agreements...</p>
                    </div>
                  )}
                  {!loading && filteredAgreements.map((agreement) => {
                    const hasCounterparty =
                      Boolean(agreement.counterparty) && agreement.counterparty !== "No depositor yet";
                    const counterpartyLabel = hasCounterparty
                      ? `${agreement.counterparty.slice(0, 6)}...${agreement.counterparty.slice(-4)}`
                      : "No depositor yet";

                    return (
                      <Card key={agreement.contractAddress} className="border border-border/60 bg-white/94 transition-transform duration-200 hover:-translate-y-0.5">
                        <CardContent className="p-5 sm:p-6">
                          <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-display text-[1.9rem] font-black tracking-[-0.05em] text-foreground">
                                  {agreement.title}
                                </h3>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                  <span>Contract:</span>
                                  <span className="font-medium text-foreground">
                                    {agreement.contractAddress.slice(0, 6)}...{agreement.contractAddress.slice(-4)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-muted"
                                    onClick={() => handleCopyContractAddress(agreement.contractAddress)}
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                <UnifiedBadge type={agreement.role} size="m" />
                                <UnifiedBadge type={`status-${agreement.status}`} size="m" />
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/contract/${agreement.contractAddress}`}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                              <div className="rounded-[1.4rem] bg-primary-50/80 px-4 py-3.5">
                                <span className="text-muted-foreground">Amount</span>
                                <div className="mt-1.5 font-semibold text-foreground">{agreement.amount} {agreement.currency}</div>
                              </div>
                              <div className="rounded-[1.4rem] bg-muted/60 px-4 py-3.5">
                                <span className="text-muted-foreground">Counterparty</span>
                                <div className="mt-1.5 flex items-center gap-1.5">
                                  <span className="font-medium text-foreground">{counterpartyLabel}</span>
                                  {hasCounterparty && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-muted"
                                      onClick={() => handleCopyCounterpartyAddress(agreement.counterparty)}
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="rounded-[1.4rem] bg-muted/60 px-4 py-3.5">
                                <span className="text-muted-foreground">Deadline</span>
                                <div className="mt-1.5 font-medium text-foreground">{formatDateShort(agreement.deadline)}</div>
                              </div>
                              <div className="rounded-[1.4rem] bg-muted/60 px-4 py-3.5">
                                <span className="text-muted-foreground">{agreement.status === AgreementStatus.filled ? 'Days left' : 'Created'}</span>
                                <div className="mt-1.5 font-medium text-foreground">{agreement.status === AgreementStatus.filled ? `${getDaysUntilDeadline(agreement.deadline)} days` : formatDateShort(agreement.createdAt)}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {!loading && filteredAgreements.length === 0 && (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Shield className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground">No agreements found</h3>
                      <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">{activeTab === 'all' ? "You haven't created or participated in any deposit agreements yet." : `You haven't ${activeTab === 'creator' ? 'created' : 'participated in'} any agreements yet.`}</p>
                      <Button className="mt-5" asChild>
                        <Link href="/creator"><Plus className="w-4 h-4 mr-2" />Create an Agreement</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-0 bg-primary text-primary-foreground">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="font-display text-[clamp(2rem,3vw,3rem)] font-black tracking-[-0.06em]">Need a deposit?</h3>
                  <p className="mt-3 text-base leading-7 text-secondary-900/80">Create a new deposit agreement in minutes.</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/22">
                  <Users className="w-7 h-7" />
                </div>
              </div>
              <div>
                <p className="mb-4 max-w-sm text-sm leading-7 text-secondary-900/72">
                  Start from the creator flow when you need a new escrow for a rental customer.
                </p>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary-600" asChild>
                  <Link href="/creator"><Plus className="w-4 h-4 mr-2" />Create Agreement</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-secondary text-secondary-foreground">
            <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="font-display text-[clamp(2rem,3vw,3rem)] font-black tracking-[-0.06em]">Have a contract link?</h3>
                  <p className="mt-3 text-base leading-7 text-white/72">Open the deposit entry route and continue with your wallet.</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12">
                  <Lock className="w-7 h-7" />
                </div>
              </div>
              <div>
                <p className="mb-4 max-w-sm text-sm leading-7 text-white/64">
                  Use the entry route when a business already sent you the escrow contract.
                </p>
                <Button className="bg-white text-secondary-700 hover:bg-muted-50" asChild>
                  <Link href="/contract/entry"><Calendar className="w-4 h-4 mr-2" />Enter Code</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
