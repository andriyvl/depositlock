"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../auth/auth.hook";
import { useAgreements } from "../shared/agreements.hook";
import { addContract as addContractAction } from '../shared/db-contracts/contracts.actions';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedBadge } from "@/lib/features/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Plus, Eye, Clock, Shield, TrendingUp, Calendar, DollarSign, Users, Settings, ExternalLink, Filter, Search, Loader2, AlertCircle, PlusCircle, RefreshCw, Copy, Network, X } from "lucide-react";
import { formatDateShort, getDaysUntilDeadline } from "@/lib/helpers/date.helpers";

import { verifyUserRole, copyContractAddress } from "@/lib/helpers/contract.helpers";
import { getNetworkIdFromProvider } from "@/lib/helpers/network.helpers";
import { AgreementStatus, AgreementStatusName } from "@/lib/model/agreement.types";
import { StatusWidgets } from "./components/status-widgets";


export function Dashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [showAddContract, setShowAddContract] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  const [validationMessage, setValidationMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgreementStatusName | "all">("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);


  const [verifying, setVerifying] = useState(false);
  
  const { user, isAuthenticated, login, isAuthLoading } = useAuth();
  const { agreements, loading, error, fetchAgreements } = useAgreements({user});

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

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
      const role = await verifyUserRole(contractAddress.trim(), user.address);

      if (role) {
        const networkId = await getNetworkIdFromProvider();

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
        <Card className="w-96 shadow-lg border-0 bg-background/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Connect your wallet to view and manage your deposit agreements
            </p>
            <Button 
              onClick={login} 
              disabled={isAuthLoading}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary/90 hover:to-secondary/90"
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
        <Card className="w-96 shadow-lg border-0 bg-background/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-muted-foreground text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <StatusWidgets stats={stats} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your deposit agreements and track their status

            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => setShowAddContract(!showAddContract)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Existing Contract
            </Button>
            <Button variant="gradientSecondaryTertiary" asChild>
              <Link href="/creator"><Plus className="w-4 h-4 mr-2" />Create Agreement</Link>
            </Button>
          </div>
        </div>

        {showAddContract && (
          <Card className="mb-6 border-primary-200 bg-primary-50/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Existing Contract</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contract Address</label>
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {validationMessage && (
                  <div className={`p-3 rounded-md text-sm ${
                    validationMessage.includes('✅') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : validationMessage.includes('❌')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {validationMessage}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
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

        <Card className="shadow-lg border-primary-200 bg-primary-50/30">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl">Your Agreements</CardTitle>
                <CardDescription>View and manage all your deposit agreements</CardDescription>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                {/* <Button variant="outline" size="sm"><Search className="w-4 h-4 mr-2" />Search</Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showFilters && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
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
                    <label className="block text-sm font-medium mb-2">Network</label>
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="creator">As Creator ({agreements.filter(a => a.role === 'creator').length})</TabsTrigger>
                <TabsTrigger value="depositor">As Depositor ({agreements.filter(a => a.role === 'depositor').length})</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {loading && (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4 mx-auto" />
                      <p className="text-muted-foreground">Loading your agreements...</p>
                    </div>
                  )}
                  {!loading && filteredAgreements.map((agreement) => (
                    <Card key={agreement.contractAddress} className="border border-border/50 hover:shadow-md transition-shadow bg-background">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{agreement.title}</h3>
                                <div className="flex items-center flex-wrap space-x-2 gap-2 mb-2">
                                  <div className="flex items-center flex-wrap space-x-1 text-md text-muted-foreground">
                                    <span>Contract:</span>
                                    <span className="font-medium text-foreground">{agreement.contractAddress.slice(0, 6)}...{agreement.contractAddress.slice(-4)}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 hover:bg-muted"
                                      onClick={() => handleCopyContractAddress(agreement.contractAddress)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center flex-wrap space-x-2 gap-2 justify-end">
                                <UnifiedBadge type={agreement.role} size="m" />
                                <UnifiedBadge type={`status-${agreement.status}`} size="m" />
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/contract/${agreement.contractAddress}`}><Eye className="w-4 h-4 mr-1" />View</Link>
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Amount:</span>
                                <div className="font-medium">{agreement.amount} {agreement.currency}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Counterparty:</span>
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium text-foreground">{agreement.counterparty.slice(0, 6)}...{agreement.counterparty.slice(-4)}</span>
                                  {agreement.counterparty && agreement.counterparty !== 'No depositor yet' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 hover:bg-muted"
                                      onClick={() => handleCopyCounterpartyAddress(agreement.counterparty)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Deadline:</span>
                                <div className="font-medium">{formatDateShort(agreement.deadline)}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{agreement.status === AgreementStatus.filled ? 'Days Left:' : 'Created:'}</span>
                                <div className="font-medium">{agreement.status === AgreementStatus.filled ? `${getDaysUntilDeadline(agreement.deadline)} days` : formatDateShort(agreement.createdAt)}</div>
                              </div>
                            </div>
                          </div>



                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!loading && filteredAgreements.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No agreements found</h3>
                      <p className="text-center text-muted-foreground mb-4">{activeTab === 'all' ? "You haven't created or participated in any deposit agreements yet." : `You haven't ${activeTab === 'creator' ? 'created' : 'participated in'} any agreements yet.`}</p>
                      <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" asChild>
                        <Link href="/creator"><Plus className="w-4 h-4 mr-2" />Create an Agreement</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Need a Deposit?</h3>
                  <p className="opacity-90 mb-4">Create a new deposit agreement in minutes</p>
                  <Button className="bg-white text-primary-600 hover:bg-gray-50" asChild>
                    <Link href="/creator"><Plus className="w-4 h-4 mr-2" />Create Agreement</Link>
                  </Button>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-tertiary-500 to-accent-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Have a Code?</h3>
                  <p className="opacity-90 mb-4">Enter a deposit agreement code to participate</p>
                  <Button className="bg-white text-tertiary-600 hover:bg-gray-50" asChild>
                    <Link href="/contract/entry"><Calendar className="w-4 h-4 mr-2" />Enter Code</Link>
                  </Button>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
