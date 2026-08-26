import React from "react";
import { Metadata } from "next";
import HomePage, { generateMetadata as generateHomeMetadata } from "./[lang]/page";
import LocaleLayout from "./[lang]/layout";

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata({ params: { lang: "pt" } });
}

export default function RootPage() {
  return (
    <LocaleLayout params={{ lang: "pt" }}>
      <HomePage params={{ lang: "pt" }} />
    </LocaleLayout>
  );
}
