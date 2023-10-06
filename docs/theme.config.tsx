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
      <link rel="icon" type="image/png" href="./favicon.ico" />
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
