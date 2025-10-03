"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { copyContractAddress, copyContractLink } from '@/lib/helpers/contract.helpers';
import { useAuth } from "@/lib/features/auth/auth.hook";
import { useWallet } from "@/lib/features/web3/wallet/wallet.hook";
import { useContract } from "@/lib/features/shared/contract.hook";
import {
  NETWORK_CONFIGS,
  getSupportedCurrencies,
  getNetworkDisplayName,
  getDefaultCurrency,
  SupportedNetworkIds,
} from "@/lib/model/network.config";
import { useContracts } from "../shared/db-contracts/contracts.hook";
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Shield,
  Copy,

  CheckCircle,
  Globe,
  Wallet,
  AlertCircle,
  Loader2
} from "lucide-react";
import { ViewOnExplorer } from "@/lib/features/shared";
import { polygonAmoy } from '@reown/appkit/networks';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  title: string;
  description: string;
  amount: string;
  currency: string;
  deadline: string;
  networkId: SupportedNetworkIds;
}

export function CreatorForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    amount: "",
    currency: getDefaultCurrency(SupportedNetworkIds.polygonAmoy),
    deadline: "",
    networkId: SupportedNetworkIds.polygonAmoy
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>("");
  const auth = useAuth();
  const { createContract } = useContract();
  const wallet = useWallet();
  const { addContract } = useContracts();

  const progress = (currentStep / 4) * 100;

  const isStepValid = (step: Step): boolean => {
    switch (step) {
      case 1:
        return auth.isAuthenticated;
      case 2:
        return !!(
          formData.title.trim() &&
          formData.amount.trim() &&
          formData.deadline.trim() &&
          parseFloat(formData.amount) > 0
        );
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'networkId') {
      // When network changes, update currency to default for that network
      const defaultCurrency = getDefaultCurrency(value as SupportedNetworkIds);
      setFormData(prev => ({ ...prev, [field]: value as SupportedNetworkIds, currency: defaultCurrency }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAuthentication = async () => {
    try {
      await auth.login();
      if (auth.isAuthenticated) {
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const onAmoy = await wallet.ensureAmoyNetwork?.();
      if (onAmoy === false) {
        throw new Error('Please switch to Polygon Amoy network');
      }
      const deadlineDate = new Date(formData.deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);

      // Deploy real contract - using ZeroAddress for open access
      const deployedAddress = await createContract(formData.amount, deadlineTimestamp, formData.title, formData.description, formData.networkId);
      if (!deployedAddress) {
        throw new Error('Failed to get deployed contract address');
      }

      // Add the contract to user's tracking
      addContract({
        contractAddress: deployedAddress,
        role: 'creator',
        networkId: formData.networkId,
      });

      setContractAddress(deployedAddress);
      setCurrentStep(4);
    } catch (error) {
      console.error("Failed to deploy contract:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyContractLink = async () => {
    await copyContractLink(contractAddress);
  };

  const handleCopyContractAddress = async () => {
    await copyContractAddress(contractAddress);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Create Deposit Agreement</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </span>
          </div>
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Connect</span>
            <span>Details</span>
            <span>Review</span>
            <span>Deploy</span>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                currentStep === 1 ? 'bg-gradient-to-br from-primary-400 to-primary-500' :
                currentStep === 2 ? 'bg-gradient-to-br from-secondary-400 to-secondary-500' :
                currentStep === 3 ? 'bg-gradient-to-br from-tertiary-400 to-tertiary-500' :
                'bg-gradient-to-br from-accent-400 to-accent-500'
              }`}>
                {currentStep === 1 && <Wallet className="w-5 h-5 text-white" />}
                {currentStep === 2 && <Calendar className="w-5 h-5 text-white" />}
                {currentStep === 3 && <Shield className="w-5 h-5 text-white" />}
                {currentStep === 4 && <CheckCircle className="w-5 h-5 text-white" />}
              </div>
              <div>
                <CardTitle>
                  {currentStep === 1 && "Connect Wallet"}
                  {currentStep === 2 && "Agreement Details"}
                  {currentStep === 3 && "Review & Confirm"}
                  {currentStep === 4 && "Success!"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Connect your wallet to create deposit agreements"}
                  {currentStep === 2 && "Set the terms for your deposit agreement"}
                  {currentStep === 3 && "Review all details before deployment"}
                  {currentStep === 4 && "Your contract has been deployed"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet to create and deploy deposit agreements on the blockchain
                  </p>
                </div>

                {!auth.isAuthLoading && !auth.isAuthenticated && auth.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Authentication Error</h4>
                        <p className="text-sm text-red-700 mt-1">{auth.error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary-800">Why Connect?</h4>
                      <ul className="text-sm text-primary-700 mt-1 space-y-1">
                        <li>• Deploy smart contracts to the blockchain</li>
                        <li>• Sign transactions securely</li>
                        <li>• Manage your deposit agreements</li>
                        <li>• Receive funds when released</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {!auth.isAuthenticated ? (
                  <Button
                    onClick={handleAuthentication}
                    disabled={auth.isAuthLoading}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                    size="lg"
                  >
                    {auth.isAuthLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting Wallet...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet to Continue
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary-600" />
                        <div>
                          <h4 className="font-medium text-secondary-800">Wallet Connected</h4>
                          <p className="text-sm font-mono text-secondary-700 mt-1 break-all">
                            {auth.user?.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full"
                      variant="gradientSecondaryTertiary"
                      size="lg"
                    >
                      Continue to Agreement Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Agreement Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Apartment Rental Deposit"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details about this deposit agreement..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Deposit Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={`${formData.currency} - ${getNetworkDisplayName(formData.networkId as SupportedNetworkIds)}`}
                      disabled
                      className="mt-1 w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Native currency for {getNetworkDisplayName(formData.networkId as SupportedNetworkIds)}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Return Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="network">Blockchain Network</Label>
                  <select
                    id="network"
                    value={formData.networkId}
                    disabled
                    onChange={(e) => handleInputChange('networkId', e.target.value)}
                    className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    {Object.entries(NETWORK_CONFIGS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.displayName}{config.testnet ? ' (Testnet)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {NETWORK_CONFIGS[formData.networkId]?.testnet
                      ? 'Testnet for development and testing'
                      : 'Production network with real value'
                    }
                  </p>
                </div>

                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-secondary-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-secondary-800">Open Access</h4>
                      <p className="text-sm text-secondary-700 mt-1">
                        Any wallet holder can access and deposit to this agreement using the link you'll receive.
                        No need to specify a depositor address beforehand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-medium text-primary-800 mb-2">Agreement Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="text-muted-foreground">Title:</span> {formData.title}</div>
                      <div><span className="text-muted-foreground">Amount:</span> {formData.amount} {formData.currency}</div>
                      <div><span className="text-muted-foreground">Deadline:</span> {new Date(formData.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                    <h4 className="font-medium text-secondary-800 mb-2">Network & Creator</h4>
                    <div className="space-y-1 text-sm text-secondary-700">
                      <div><span className="text-muted-foreground">Network:</span> {getNetworkDisplayName(formData.networkId)}</div>
                      <div><span className="text-muted-foreground">Creator:</span> <span className="font-mono">{auth.user?.address.slice(0, 6)}...{auth.user?.address.slice(-4)}</span></div>
                      <div><span className="text-muted-foreground">Access:</span> Open to any wallet</div>
                    </div>
                  </div>
                </div>

                {formData.description && (
                  <div className="bg-tertiary-50 border border-tertiary-200 rounded-lg p-4">
                    <h4 className="font-medium text-tertiary-800 mb-2">Description</h4>
                    <p className="text-sm text-tertiary-700">{formData.description}</p>
                  </div>
                )}

                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">What happens next?</span>
                  </div>
                  <ol className="text-sm text-muted-foreground space-y-1 ml-6 list-decimal">
                    <li>Smart contract will be deployed to {getNetworkDisplayName(formData.networkId)}</li>
                    <li>You'll get a shareable link for anyone to deposit</li>
                    <li>Funds will be locked until the deadline</li>
                    <li>You can release funds manually when appropriate</li>
                  </ol>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Contract Deployed Successfully!</h3>
                  <p className="text-muted-foreground">
                    Your deposit agreement is now live on {getNetworkDisplayName(formData.networkId)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Contract Address</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={handleCopyContractAddress}>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy Address
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-mono text-xs">{contractAddress}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to copy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="font-mono text-sm bg-muted p-2 rounded break-all cursor-pointer hover:bg-muted/80 transition-colors" onClick={handleCopyContractAddress}>
                      {contractAddress}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is your deployed contract address on {getNetworkDisplayName(formData.networkId)}
                    </p>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Share this link</span>
                      <Button variant="outline" size="sm" onClick={handleCopyContractLink}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </Button>
                    </div>
                    <div className="font-mono text-sm bg-muted p-2 rounded break-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}/contract/${contractAddress}` : ''}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Send this link to anyone who needs to make the deposit
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" asChild>
                    <Link href={`/contract/${contractAddress}`}>
                      View Contract
                    </Link>
                  </Button>
                  <ViewOnExplorer
                    contractAddress={contractAddress}
                    networkId={formData.networkId}
                  />
                </div>
              </div>
            )}
          </CardContent>

          {currentStep < 4 && currentStep > 1 && (
            <div className="px-6 pb-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                  >
                    {isDeploying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        Deploy Contract
                        <Check className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
