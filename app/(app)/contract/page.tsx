"use client";

import Link from "next/link";

export default function ContractPage() {
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Contract View</h1>
      <p className="mt-2 text-muted-foreground">Enter via agreement link from Creator. Example:</p>
      <div className="mt-6">
        <Link className="underline text-primary" href="/contract/0x123">/contract/0x123</Link>
      </div>
    </main>
  );
}
