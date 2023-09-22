import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  project: {
    link: "https://github.com/sikka-software/hajar",
  },
  docsRepositoryBase: "https://github.com/sikka-software/hajar/docs",

  logo: <span>My Project</span>,

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

  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Your documentation site" />
      <meta name="og:title" content="Your Documentation" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Hajar",
    };
  },

  chat: {
    link: "https://discord.com",
  },
  footer: {
    text: "Nextra Docs Template",
  },
  toc: {
    backToTop: true,
  },
};

export default config;
