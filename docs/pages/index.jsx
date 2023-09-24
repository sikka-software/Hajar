import { Callout } from "nextra-theme-docs";
import Landing from "components/landing";
import FeatureCard from "components/FeatureCard";
import { Bleed } from "nextra-theme-docs";

import { Button } from "@sikka/hawa";
import Link from "next/link";
import React from "react";

const IndexPage = () => (
  <div className="flex flex-col justify-center items-center text-center p-10 gap-6">
    <div className="flex flex-col  justify-center items-center max-w-lg">
      <h1 className="text-center text-4xl tracking-tighter font-extrabold md:text-5xl mb-10">
        Hajar
      </h1>
      <span>
        Hajar is a comprehensive toolkit for SaaS application development,
        offering simplified solutions for authentication, email management,
        database operations, storage, and more.
      </span>
    </div>
    <div className="flex flex-col justify-center items-center text-center">
      <div className="flex flex-row gap-2">
        <Link href="/docs">
          <Button>Docs</Button>
        </Link>
        <a href="https://github.com/sikka-software/hajar">
          <Button variant="outline">Github</Button>
        </a>
      </div>
      <p className="flex h-6 mt-4 gap-2">
        <img alt="downloads" src="https://badgen.net/npm/v/@sikka/hajar" />
        <img alt="downloads" src="https://badgen.net/npm/v/@sikka/hajar/beta" />
      </p>
    </div>
    <div className="p-1 px-2 flex text-sm flex-row bg-yellow-100 border-yellow-300 border-2">
      ⌛ This docs site is still work in progress
    </div>
    <div className="grid grid-cols-2 gap-2 w-full max-w-lg ">
      <FeatureCard
        link="/docs/authentication"
        title="Authentication"
        subtitle="Run common authentication methods"
      />
      <FeatureCard
        link="/docs/database"
        title="Database"
        subtitle="Setup & connect to a DB"
      />
      <FeatureCard
        link="/docs/storage"
        title="Storage"
        subtitle="Setup storage and upload/download files"
      />
      <FeatureCard link="/docs/emails" title="Emails" subtitle="Setup, send, and schedule emails" />
    </div>

    <div className="flex w-full flex-col items-center opacity-50 ">
      <a href="https://sikka.io">
        <img
          width="20"
          alt="Sikka"
          src={
            "https://sikka-images.s3.ap-southeast-1.amazonaws.com/sikka/brand/black-symbol.png"
          }
        />
      </a>
      <p align="center" className="m-0 mb-4 ">
        <sub>
          <a href="https://sikka.io">An open source project by Sikka</a>
        </sub>
      </p>
    </div>
  </div>
);

export default IndexPage;
