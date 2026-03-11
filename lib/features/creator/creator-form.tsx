"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { copyContractAddress, copyContractLink } from '@/lib/helpers/contract.helpers';
import { useAuth } from "@/lib/features/auth/auth.hook";
import { useWallet } from "@/lib/features/web3/wallet/wallet.hook";
import { useContract } from "@/lib/features/shared/contract.hook";
import {
  DEPLOYMENT_NETWORKS,
  getSupportedCurrencies,
  getNetworkDisplayName,
  getDefaultCurrency,
  SupportedNetworkIds,
} from "@/lib/model/network.config";
import { showToast } from "@/lib/features/shared/components/show-toast";
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
  Loader2,
} from "lucide-react";
import { ViewOnExplorer } from "@/lib/features/shared";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  title: string;
  description: string;
  amount: string;
  currency: string;
  deadline: string;
  networkId: SupportedNetworkIds;
}

interface DeploymentEstimate {
  gasLimit: string;
  gasPriceGwei: string;
  l1DataFeeNative: string;
  totalFeeNative: string;
  nativeSymbol: string;
}

interface NativeUsdPriceSnapshot {
  usd: number;
  fetchedAt: number;
}

const COINGECKO_NATIVE_PRICE_IDS: Partial<Record<SupportedNetworkIds, string[]>> = {
  [SupportedNetworkIds.polygon]: ["polygon-ecosystem-token"],
  [SupportedNetworkIds.polygonAmoy]: ["polygon-ecosystem-token"],
  [SupportedNetworkIds.arbitrum]: ["ethereum"],
  [SupportedNetworkIds.optimism]: ["ethereum"],
  [SupportedNetworkIds.base]: ["ethereum"],
  [SupportedNetworkIds.mantle]: ["mantle"],
  [SupportedNetworkIds.ethereum]: ["ethereum"],
};

const NATIVE_USD_PRICE_REFRESH_MS = 5 * 60 * 1000;

function formatStablecoinEquivalent(amount: number): string {
  if (amount >= 1) return amount.toFixed(2);
  if (amount >= 0.1) return amount.toFixed(3);
  if (amount >= 0.01) return amount.toFixed(4);
  return amount.toFixed(6);
}

function getPreferredCurrency(networkId: SupportedNetworkIds, currentCurrency: string): string {
  const supportsCurrentCurrency = getSupportedCurrencies(networkId).some(
    (token) => token.symbol === currentCurrency
  );

  return supportsCurrentCurrency ? currentCurrency : getDefaultCurrency(networkId);
}

export function CreatorForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    amount: "",
    currency: getDefaultCurrency(SupportedNetworkIds.polygon),
    deadline: "",
    networkId: SupportedNetworkIds.polygon
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [deploymentEstimate, setDeploymentEstimate] = useState<DeploymentEstimate | null>(null);
  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  const [nativeUsdPriceByNetwork, setNativeUsdPriceByNetwork] = useState<
    Partial<Record<SupportedNetworkIds, NativeUsdPriceSnapshot>>
  >({});
  const [isLoadingNativeUsdPrice, setIsLoadingNativeUsdPrice] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const auth = useAuth();
  const { createContract, estimateDeploymentCost } = useContract();
  const wallet = useWallet();
  const { addContract } = useContracts();
  const estimateDeploymentCostRef = useRef(estimateDeploymentCost);

  useEffect(() => {
    estimateDeploymentCostRef.current = estimateDeploymentCost;
  }, [estimateDeploymentCost]);

  const progress = (currentStep / 4) * 100;

  useEffect(() => {
    const walletNetworkId = wallet.selectedNetworkId;

    if (!wallet.isConnected || !walletNetworkId) {
      return;
    }

    if (!DEPLOYMENT_NETWORKS.includes(walletNetworkId)) {
      return;
    }

    setFormData((prev) => {
      const nextCurrency = getPreferredCurrency(walletNetworkId, prev.currency);

      if (prev.networkId === walletNetworkId && prev.currency === nextCurrency) {
        return prev;
      }

      return {
        ...prev,
        networkId: walletNetworkId,
        currency: nextCurrency,
      };
    });
  }, [wallet.isConnected, wallet.selectedNetworkId]);

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

  const handleInputChange = (field: Exclude<keyof FormData, 'networkId'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNetworkChange = async (networkId: SupportedNetworkIds) => {
    if (networkId === formData.networkId) {
      return;
    }

    const switchedNetwork = await wallet.ensureNetwork?.(networkId);
    if (switchedNetwork === false) {
      showToast(`Please switch your wallet to ${getNetworkDisplayName(networkId)}.`, 'error');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      networkId,
      currency: getPreferredCurrency(networkId, prev.currency),
    }));
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
    setDeployError(null);
    let deployedAddress: string | null = null;
    try {
      const onSelectedNetwork = await wallet.ensureNetwork?.(formData.networkId);
      if (onSelectedNetwork === false) {
        throw new Error(`Please switch to ${getNetworkDisplayName(formData.networkId)}`);
      }
      const deadlineDate = new Date(formData.deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);

      // Deploy real contract - using ZeroAddress for open access
      deployedAddress = await createContract(
        formData.amount,
        deadlineTimestamp,
        formData.title,
        formData.description,
        formData.networkId,
        formData.currency
      );
      if (!deployedAddress) {
        throw new Error('Failed to get deployed contract address');
      }

      // Add the contract to user's tracking
      await addContract({
        contractAddress: deployedAddress,
        role: 'creator',
        networkId: formData.networkId,
      });

      setContractAddress(deployedAddress);
      setCurrentStep(4);
    } catch (error: any) {
      console.error("Failed to deploy contract:", error);
      if (deployedAddress) {
        setContractAddress(deployedAddress);
        setCurrentStep(4);
        setDeployError(
          `Contract was deployed at ${deployedAddress}, but dashboard sync failed. Add it manually from dashboard (network: ${getNetworkDisplayName(formData.networkId)}).`
        );
      } else {
        setDeployError(
          error?.message || "Failed to deploy contract."
        );
      }
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

  useEffect(() => {
    const amountValue = Number(formData.amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setDeploymentEstimate(null);
      setEstimateError(null);
      setIsEstimatingCost(false);
      return;
    }

    const effectiveDeadline = formData.deadline
      ? Math.floor(new Date(formData.deadline).getTime() / 1000)
      : Math.floor(Date.now() / 1000) + 7 * 24 * 3600;

    const title = formData.title.trim() || "Deposit Agreement";
    const description = formData.description.trim() || "Secure deposit agreement created via DepositLock";

    let isCancelled = false;
    setIsEstimatingCost(true);
    setEstimateError(null);

    const timeoutId = window.setTimeout(async () => {
      try {
        const estimate = await estimateDeploymentCostRef.current(
          formData.amount,
          effectiveDeadline,
          title,
          description,
          formData.networkId,
          formData.currency
        );

        if (!isCancelled) {
          setDeploymentEstimate(estimate);
        }
      } catch (error: unknown) {
        if (!isCancelled) {
          const message = error instanceof Error ? error.message : "Unable to estimate deployment cost.";
          setEstimateError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsEstimatingCost(false);
        }
      }
    }, 500);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    formData.amount,
    formData.deadline,
    formData.title,
    formData.description,
    formData.networkId,
    formData.currency,
  ]);

  useEffect(() => {
    const coingeckoIds = COINGECKO_NATIVE_PRICE_IDS[formData.networkId];
    if (!coingeckoIds?.length) {
      setIsLoadingNativeUsdPrice(false);
      return;
    }

    let isCancelled = false;
    const cachedPrice = nativeUsdPriceByNetwork[formData.networkId];
    const hasFreshCachedPrice =
      cachedPrice !== undefined &&
      Date.now() - cachedPrice.fetchedAt < NATIVE_USD_PRICE_REFRESH_MS;

    const fetchNativeUsdPrice = async (isInitial: boolean) => {
      if (isInitial && !cachedPrice) {
        setIsLoadingNativeUsdPrice(true);
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coingeckoIds.join(','))}&vs_currencies=usd`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch native token price.");
        }

        const data = await response.json() as Record<string, { usd?: number }>;
        const price = coingeckoIds
          .map((coingeckoId) => Number(data?.[coingeckoId]?.usd))
          .find((value) => Number.isFinite(value) && value > 0);

        if (price === undefined || !Number.isFinite(price) || price <= 0) {
          throw new Error("Invalid native token price.");
        }

        if (!isCancelled) {
          setNativeUsdPriceByNetwork((prev) => ({
            ...prev,
            [formData.networkId]: {
              usd: price,
              fetchedAt: Date.now(),
            },
          }));
        }
      } catch {
        return;
      } finally {
        if (!isCancelled && isInitial) {
          setIsLoadingNativeUsdPrice(false);
        }
      }
    };

    if (hasFreshCachedPrice) {
      setIsLoadingNativeUsdPrice(false);
    } else {
      void fetchNativeUsdPrice(true);
    }

    const intervalId = window.setInterval(() => {
      void fetchNativeUsdPrice(false);
    }, NATIVE_USD_PRICE_REFRESH_MS);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [formData.networkId]);

  const nativeUsdPrice = nativeUsdPriceByNetwork[formData.networkId]?.usd ?? null;

  const stablecoinFeeEquivalent = useMemo(() => {
    if (!deploymentEstimate || nativeUsdPrice === null) return null;
    const nativeFee = Number(deploymentEstimate.totalFeeNative);
    if (!Number.isFinite(nativeFee) || nativeFee <= 0) return null;
    return nativeFee * nativeUsdPrice;
  }, [deploymentEstimate, nativeUsdPrice]);

  const stepDetails: Record<
    Step,
    {
      eyebrow: string;
      title: string;
      description: string;
      summary: string;
      icon: React.ElementType;
      accentClassName: string;
      pillClassName: string;
    }
  > = {
    1: {
      eyebrow: "Wallet and access",
      title: "Connect the creator wallet",
      description: "Authenticate with the wallet that will create and manage the rental deposit contract.",
      summary: "Creator sign in",
      icon: Wallet,
      accentClassName: "bg-primary text-primary-foreground",
      pillClassName: "bg-primary-50 text-secondary-800",
    },
    2: {
      eyebrow: "Agreement setup",
      title: "Define the deposit terms",
      description: "Set the amount, stablecoin, deadline, and chain where the escrow contract will live.",
      summary: "Terms and network",
      icon: Calendar,
      accentClassName: "bg-secondary text-secondary-foreground",
      pillClassName: "bg-secondary text-secondary-foreground",
    },
    3: {
      eyebrow: "Final review",
      title: "Review what the renter will see",
      description: "Check the details before deployment so the shareable contract link starts with clean terms.",
      summary: "Pre-deploy review",
      icon: Shield,
      accentClassName: "bg-tertiary-100 text-tertiary-700",
      pillClassName: "bg-tertiary-100 text-tertiary-700",
    },
    4: {
      eyebrow: "Contract live",
      title: "Share the deployed agreement",
      description: "Copy the contract address or the renter link and continue from the contract workspace.",
      summary: "Success",
      icon: CheckCircle,
      accentClassName: "bg-primary text-primary-foreground",
      pillClassName: "bg-primary text-primary-foreground",
    },
  };

  const stepOrder: Step[] = [1, 2, 3, 4];
  const currentStepDetails = stepDetails[currentStep];
  const CurrentStepIcon = currentStepDetails.icon;
  const creatorAddress = auth.user?.address
    ? `${auth.user.address.slice(0, 6)}...${auth.user.address.slice(-4)}`
    : "Wallet pending";
  const contractLink =
    typeof window !== "undefined" && contractAddress
      ? `${window.location.origin}/contract/${contractAddress}`
      : "";

  return (
    <div className="px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="relative overflow-hidden rounded-[2.75rem] bg-secondary px-6 py-7 text-secondary-foreground shadow-card sm:px-8 sm:py-8 lg:min-h-[860px] lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,240,117,0.28),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(94,230,255,0.14),transparent_32%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-white/88">
                Creator workspace
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-white/88">
                Ethereum + supported L2s
              </span>
            </div>

            <div className="mt-7 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                Step {currentStep} of 4
              </p>
              <h3 className="mt-4 font-display text-[clamp(2.8rem,5vw,3.5rem)] font-black text-white">
                Create the deposit contract & share it with the renter.
              </h3>
              <p className="mt-4 text-base leading-8 text-white/72 sm:text-lg">
                DepositLock lets small rental operators launch a crypto escrow contract for bikes,
                flats, cameras, transport, and other real-world assets without adding manual admin to
                every handover.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {stepOrder.map((step) => {
                const details = stepDetails[step];
                const StepIcon = details.icon;
                const isActive = step === currentStep;
                const isComplete = step < currentStep;

                return (
                  <div
                    key={step}
                    className={`rounded-[1.75rem] border px-5 py-4 transition ${isActive
                      ? "border-white/18 bg-white/14"
                      : isComplete
                        ? "border-white/12 bg-white/10"
                        : "border-white/10 bg-white/6"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isActive || isComplete ? "bg-primary text-primary-foreground" : "bg-white/12 text-white/74"
                          }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-white">{details.summary}</p>
                          <span className="text-xs uppercase tracking-[0.05em] text-white/46">
                            {isComplete ? "Done" : `0${step}`}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-white/68">{details.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto grid gap-4 pt-8 md:grid-cols-2">
              <div className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-white/60">
                  Rental businesses
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Bike rentals", "Apartments", "Photo gear", "Transport fleets"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/82"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/12 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-white/60">
                  Supported networks
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Ethereum", "Arbitrum", "Base", "Optimism", "Polygon", "Mantle"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/82"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <Card className="bg-white/86">
            <CardContent className="p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.05em] text-secondary-700">
                    {currentStepDetails.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] text-foreground font-black sm:text-4xl">
                    {currentStepDetails.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {currentStepDetails.description}
                  </p>
                </div>
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${currentStepDetails.accentClassName}`}
                >
                  <CurrentStepIcon className="h-6 w-6" />
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-foreground">Progress</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-muted/80" />
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {stepOrder.map((step) => (
                    <div
                      key={step}
                      className={`rounded-2xl px-3 py-2 text-center self-center text-xs font-semibold ${step === currentStep
                        ? currentStepDetails.pillClassName
                        : step < currentStep
                          ? "bg-primary-50 text-secondary-800"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {stepDetails[step].summary}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {deployError && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50/90 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Deployment sync issue</h3>
                  <p className="mt-1 text-sm leading-6 text-red-700">{deployError}</p>
                </div>
              </div>
            </div>
          )}

          <Card className="overflow-hidden bg-white/92">
            <CardHeader className="border-b border-border/60 pb-5">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="rounded-full border border-border/70 bg-background/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {currentStepDetails.summary}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="rounded-full border border-border/70 bg-primary-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-secondary-800">
                        {getNetworkDisplayName(formData.networkId)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current selected network</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="rounded-full border border-border/70 bg-background/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {formData.currency}
                </span>
              </div>
              <CardTitle>
                {currentStep === 1 && "Creator access"}
                {currentStep === 2 && "Agreement details"}
                {currentStep === 3 && "Final confirmation"}
                {currentStep === 4 && "Contract ready"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 &&
                  "Use the wallet that should appear as the contract creator and future manager."}
                {currentStep === 2 &&
                  "These details become the shareable escrow terms for the renter or depositor."}
                {currentStep === 3 &&
                  "Double-check the agreement before you publish it on-chain."}
                {currentStep === 4 &&
                  "Keep the address for admin use and share the contract link with the renter."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-5 pt-4">
                  <div className="rounded-[2rem] border border-border/70 bg-muted/35 p-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Wallet className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Authentication is required</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                          The connected wallet deploys the contract, signs follow-up actions, and acts as
                          the creator inside the dashboard and contract workspace.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!auth.isAuthLoading && !auth.isAuthenticated && auth.error && (
                    <div className="rounded-[1.75rem] border border-red-200 bg-red-50/90 p-5">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                        <div>
                          <h3 className="font-semibold text-red-800">Authentication error</h3>
                          <p className="mt-1 text-sm leading-6 text-red-700">{auth.error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.75rem] border border-primary-200 bg-primary-50/85 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">
                        Why this matters
                      </h3>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-secondary-800">
                        <li>Deploy smart contracts directly to the selected network.</li>
                        <li>Approve releases, cancellations, and disputes from the same identity.</li>
                        <li>Track creator contracts inside the dashboard without manual reconciliation.</li>
                      </ul>
                    </div>

                    <div className="rounded-[1.75rem] border border-border/70 bg-white/88 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">
                        Network scope
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        Contracts can be created on Ethereum and supported L2 networks including
                        Arbitrum, Base, Optimism, Polygon, and Mantle using the stablecoins available
                        on each chain.
                      </p>
                    </div>
                  </div>

                  {!auth.isAuthenticated ? (
                    <Button
                      onClick={handleAuthentication}
                      disabled={auth.isAuthLoading}
                      className="w-full"
                      size="lg"
                    >
                      {auth.isAuthLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connecting wallet...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-4 w-4" />
                          Connect wallet to continue
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-[1.75rem] border border-secondary-200 bg-secondary-50/88 p-5">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 text-secondary-700" />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-secondary-800">Wallet connected</h3>
                            <p className="mt-1 break-all font-mono text-sm text-secondary-700">
                              {auth.user?.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleNext} className="w-full" size="lg">
                        Continue to agreement details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="title">Agreement title</Label>
                      <Input
                        id="title"
                        placeholder="Apartment rental security deposit"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="mt-2"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Use a label the renter will immediately recognize.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Explain what the deposit covers, when it can be released, and any conditions the renter should know."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="mt-2 min-h-32"
                        rows={5}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="amount">Deposit amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="500"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Stablecoin</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger id="currency" className="mt-2 rounded-2xl border-border/70 bg-white/90">
                          <SelectValue placeholder="Select stablecoin" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSupportedCurrencies(formData.networkId).map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              {token.symbol} - {token.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Available tokens depend on {getNetworkDisplayName(formData.networkId)}.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="deadline">Return deadline</Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange("deadline", e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="network">Blockchain network</Label>
                      <Select
                        value={formData.networkId}
                        onValueChange={(value) => void handleNetworkChange(value as SupportedNetworkIds)}
                      >
                        <SelectTrigger id="network" className="mt-2 rounded-2xl border-border/70 bg-white/90">
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
                      <p className="mt-2 text-sm text-muted-foreground">
                        This chain determines where the renter deposits and where the contract is managed.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 ">
                    <div className="rounded-[2rem] border border-border/70 bg-muted/35 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">Estimated deployment cost</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Live estimate for the selected network and contract payload.
                          </p>
                        </div>
                        <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.04em] text-primary-foreground">
                          Gas preview
                        </span>
                      </div>

                      <div className="mt-5 rounded-[1.75rem] border border-border/60 bg-white/88 p-5">
                        {isEstimatingCost ? (
                          <p className="text-sm leading-7 text-muted-foreground">Estimating network fee...</p>
                        ) : estimateError ? (
                          <p className="text-sm leading-7 text-red-700">{estimateError}</p>
                        ) : deploymentEstimate ? (
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p className="font-display text-4xl tracking-[-0.05em] text-foreground">
                              {stablecoinFeeEquivalent !== null
                                ? `~${formatStablecoinEquivalent(stablecoinFeeEquivalent)} ${formData.currency}`
                                : isLoadingNativeUsdPrice
                                  ? `~-- ${formData.currency}`
                                  : `~-- ${formData.currency}`}
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <div className="rounded-2xl bg-primary-50/85 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.16em] text-secondary-700">Native fee</p>
                                <p className="mt-1 font-semibold text-foreground">
                                  {deploymentEstimate.totalFeeNative} {deploymentEstimate.nativeSymbol}
                                </p>
                              </div>
                              <div className="rounded-2xl bg-background px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.16em] text-secondary-700">Gas price</p>
                                <p className="mt-1 font-semibold text-foreground">
                                  {Number(deploymentEstimate.gasPriceGwei).toFixed(2)} gwei
                                </p>
                              </div>
                            </div>
                            <p>Gas limit: {deploymentEstimate.gasLimit}</p>
                            {Number(deploymentEstimate.l1DataFeeNative) > 0 && (
                              <p>
                                L1 data fee: {deploymentEstimate.l1DataFeeNative}{" "}
                                {deploymentEstimate.nativeSymbol}
                              </p>
                            )}
                            {isLoadingNativeUsdPrice && (
                              <p>Refreshing native token USD conversion for the stablecoin estimate.</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm leading-7 text-muted-foreground">
                            Enter the amount and choose a network to load a deployment estimate.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-secondary-200 bg-secondary-50/88 p-5">
                      <div className="flex items-start gap-3">
                        <Globe className="mt-0.5 h-5 w-5 text-secondary-700" />
                        <div>
                          <h3 className="font-semibold text-secondary-800">Open depositor access</h3>
                          <p className="mt-2 text-sm leading-7 text-secondary-700">
                            Any wallet holder can access this agreement from the link you receive after
                            deployment. You do not need to pre-fill the depositor address.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[1.75rem] border border-secondary-200 bg-white/80 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.04em] text-secondary-700">
                          What the renter will get
                        </p>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-secondary-800">
                          <li>One shareable contract link</li>
                          <li>Clear amount, token, deadline, and description</li>
                          <li>On-chain record for funding and release actions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-primary-200 bg-primary-50/88 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">
                        Agreement details
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Title</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{formData.title}</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Amount</p>
                            <p className="mt-1 text-base font-semibold text-foreground">
                              {formData.amount} {formData.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Deadline</p>
                            <p className="mt-1 text-base font-semibold text-foreground">
                              {new Date(formData.deadline).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-secondary-200 bg-secondary-50/88 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-secondary-700">
                        Network and creator
                      </h3>
                      <div className="mt-4 space-y-4 text-sm leading-7 text-secondary-800">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-secondary-700/70">Network</p>
                          <p className="mt-1 text-base font-semibold">{getNetworkDisplayName(formData.networkId)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-secondary-700/70">Creator</p>
                          <p className="mt-1 font-mono text-base">{creatorAddress}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-secondary-700/70">Estimated deploy cost</p>
                          <p className="mt-1 text-base font-semibold">
                            {deploymentEstimate
                              ? stablecoinFeeEquivalent !== null
                                ? `~${formatStablecoinEquivalent(stablecoinFeeEquivalent)} ${formData.currency} (~${deploymentEstimate.totalFeeNative} ${deploymentEstimate.nativeSymbol})`
                                : `~${deploymentEstimate.totalFeeNative} ${deploymentEstimate.nativeSymbol}`
                              : "Estimating..."}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-secondary-700/70">Access</p>
                          <p className="mt-1 text-base font-semibold">Open to any renter wallet</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.description && (
                    <div className="rounded-[2rem] border border-tertiary-200 bg-tertiary-50/90 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-tertiary-700">
                        Description shown in the contract
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-tertiary-700">{formData.description}</p>
                    </div>
                  )}

                  <div className="rounded-[2rem] border border-border/70 bg-white/90 p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">What happens after deployment</h3>
                        <p className="text-sm text-muted-foreground">
                          The creator flow ends here, then the contract starts its renter-facing phase.
                        </p>
                      </div>
                    </div>

                    <ol className="mt-5 space-y-3 pl-5 text-sm leading-7 text-muted-foreground list-decimal">
                      <li>The escrow contract is deployed on {getNetworkDisplayName(formData.networkId)}.</li>
                      <li>You receive a contract address plus a shareable renter link.</li>
                      <li>The renter connects a wallet and deposits the chosen stablecoin.</li>
                      <li>You manage release, cancellation, or dispute directly from the contract page.</li>
                    </ol>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-8 w-8" />
                    </span>
                    <h3 className="mt-5 font-display text-4xl tracking-[-0.05em] text-foreground">
                      Contract deployed
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                      Your rental deposit agreement is live on {getNetworkDisplayName(formData.networkId)}.
                      Keep the address for admin actions and share the renter link when you are ready.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[2rem] border border-border/70 bg-white/90 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-foreground">Contract address</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm" onClick={handleCopyContractAddress}>
                                <Copy className="h-4 w-4" />
                                Copy address
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-mono text-xs">{contractAddress}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <button
                        type="button"
                        className="mt-4 w-full rounded-[1.5rem] border border-border/70 bg-muted/45 px-4 py-4 text-left font-mono text-sm text-foreground transition hover:bg-muted/65"
                        onClick={handleCopyContractAddress}
                      >
                        {contractAddress}
                      </button>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Use this address for explorer checks and contract administration.
                      </p>
                    </div>

                    <div className="rounded-[2rem] border border-primary-200 bg-primary-50/88 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-foreground">Shareable renter link</h3>
                        <Button variant="outline" size="sm" onClick={handleCopyContractLink}>
                          <Copy className="h-4 w-4" />
                          Copy link
                        </Button>
                      </div>
                      <div className="mt-4 rounded-[1.5rem] border border-primary-200 bg-white/88 px-4 py-4 font-mono text-sm text-foreground break-all">
                        {contractLink}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Send this link to the renter so they can review the terms and lock the deposit.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-secondary-200 bg-secondary-50/88 p-5">
                    <h3 className="font-semibold text-secondary-800">Recommended next move</h3>
                    <p className="mt-2 text-sm leading-7 text-secondary-700">
                      Open the contract workspace to track funding status, or verify the contract on the
                      block explorer before you send the link to the renter.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button asChild>
                      <Link href={`/contract/${contractAddress}`}>Open contract</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">Go to dashboard</Link>
                    </Button>
                    <ViewOnExplorer
                      contractAddress={contractAddress}
                      networkId={formData.networkId}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>

            {currentStep < 4 && currentStep > 1 && (
              <div className="border-t border-border/60 px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  {currentStep < 3 ? (
                    <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleDeploy} disabled={isDeploying}>
                      {isDeploying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deploying contract...
                        </>
                      ) : (
                        <>
                          Deploy contract
                          <Check className="h-4 w-4" />
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
    </div>
  );
}
