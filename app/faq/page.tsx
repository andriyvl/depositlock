import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | DepositLock",
  description: "Frequently asked questions about DepositLock escrow agreements.",
};

const faqs = [
  {
    question: "What networks are supported?",
    answer:
      "DepositLock supports Polygon Amoy, Polygon, Ethereum, and Arbitrum. Polygon is generally recommended for lower transaction costs.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "Supported currencies vary by network and include native tokens plus common stablecoins such as USDC, USDT, and DAI where available.",
  },
  {
    question: "What are the platform fees?",
    answer:
      "DepositLock charges 0 platform fees today. You only pay the blockchain gas fees required by your selected network.",
  },
  {
    question: "How does the contract work?",
    answer:
      "A creator deploys an escrow contract with amount, deadline, and terms. A depositor funds the contract. Funds are released, canceled, or disputed according to contract actions and wallet signatures.",
  },
  {
    question: "How do I create a contract?",
    answer:
      "Go to Create Agreement, connect your wallet, set the amount, deadline, and agreement details, then submit the deployment transaction.",
  },
  {
    question: "How do I withdraw funds?",
    answer:
      "Use the contract page actions to release funds when agreement conditions are met. The release transaction sends funds according to the specified release amount.",
  },
  {
    question: "How do I cancel a contract?",
    answer:
      "On the contract page, use Cancel and provide a reason. Cancellation behavior follows role checks and contract state rules.",
  },
  {
    question: "How do I dispute a contract?",
    answer:
      "Open a dispute from the contract actions, provide a dispute reason, and optionally propose a release amount. The dispute can later be resolved on-chain.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Quick answers about networks, currencies, fees, and contract actions.</p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <section key={faq.question} className="rounded-lg border border-border p-5 bg-background/70 space-y-2">
              <h2 className="text-lg font-semibold">{faq.question}</h2>
              <p className="text-muted-foreground">{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
