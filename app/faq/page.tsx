import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | DepositLock",
  description: "Common questions about DepositLock networks, currencies, fees, and escrow workflows.",
};

const faqItems = [
  {
    question: "What networks are supported?",
    answer:
      "DepositLock currently supports Ethereum, Polygon, Polygon Amoy, Arbitrum, Optimism, Base, and Mantle.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "Supported currencies depend on selected network and include native tokens plus approved stablecoins such as USDC and USDT where available.",
  },
  {
    question: "What are the platform fees?",
    answer:
      "DepositLock charges 0 platform fees. You only pay blockchain network gas fees required for transactions.",
  },
  {
    question: "How does the contract work?",
    answer:
      "A creator deploys an escrow contract with terms and amount. Depositor funds are locked until release, cancellation, or dispute resolution based on contract rules.",
  },
  {
    question: "How do I create a contract?",
    answer:
      "Connect wallet, open Create Agreement, choose network and token, set amount and deadline, then deploy the contract by signing the transaction.",
  },
  {
    question: "How do I withdraw funds?",
    answer:
      "When release is approved, the recipient uses the contract actions panel to execute release and receive funds directly in the connected wallet.",
  },
  {
    question: "How do I cancel a contract?",
    answer:
      "Use the cancel action in the contract view. Cancellation follows smart contract permissions and returns funds according to the current agreement state.",
  },
  {
    question: "How do I dispute a contract?",
    answer:
      "If terms are contested, open a dispute from the contract actions panel and submit a reason with proposed settlement details for resolution.",
  },
] as const;

export default function FaqPage() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about DepositLock escrow flows.</p>
      </header>

      <div className="space-y-4">
        {faqItems.map((item) => (
          <article key={item.question} className="rounded-xl border border-border bg-background/80 p-5 space-y-2">
            <h2 className="text-lg font-medium">{item.question}</h2>
            <p className="text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
