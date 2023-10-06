import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import { Footer } from "@sikka/hawa";

const config: DocsThemeConfig = {
  project: {
    link: "https://github.com/sikka-software/hajar",
  },
  docsRepositoryBase: "https://github.com/sikka-software/hajar/docs",

  logo: <span>Hajar</span>,
  // docsRepository: "https://github.com/your-repo", // docs repo
  // branch: "master", // branch of docs
  // titleSuffix: " – Your Docs",
  // nextLinks: true,
  // prevLinks: true,
  // customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  // footer: true,
  // footerText: "MIT 2023 © Your Name.",
  // footerEditOnGitHubLink: true, // will link to the docs repo
  gitTimestamp: false,

  head: (
    <>
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Toolkit for building SaaS applications"
      />
      <meta name="og:title" content="Hajar Docs" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Hajar",
      twitter: {
        handle: "@sikka_sa",
      },
    };
  },

  // chat: {
  //   link: "https://discord.com",
  // },
  footer: {
    component: (
      <Footer
        copyRights="Sikka Software"
        variation="minimal"
        logoURL=""
        logoText="Sikka Software"
      />
    ),
    // text: (
    //   <span>
    //     MIT {new Date().getFullYear()} ©{" "}
    //     <a href="https://nextra.site" target="_blank">
    //       Nextra
    //     </a>
    //     .
    //   </span>
    // ),
  },
  toc: {
    // extraContent: <div>something</div>,
    backToTop: true,
  },
};

export default config;
