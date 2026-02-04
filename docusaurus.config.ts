import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Nunix Universe',
  tagline: 'Traveling the Cloud Native deep space',
  favicon: 'img/favicon.svg',
  url: 'https://nunix.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nunix', // Usually your GitHub org/user name.
  projectName: 'nunix.github.io', // Usually your repo name.

  // GLOBAL VARIABLES (The Standardization)
  customFields: {
    projectName: "Nunix Universe",
    version: "v1.0.0",
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'dark',
    },
    imageZoom: {
      selector: '.markdown img', 
      options: {
        margin: 24,
        background: 'rgba(0, 0, 0, 0.8)',
        scrollOffset: 0,
      },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Nunix Universe',
        src: 'img/nunix-banner.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'technical',
          position: 'left',
          label: '🛰️ Deep Space Intel',
        },
        {
          type: 'docSidebar',
          sidebarId: 'personal',
          position: 'left',
          label: '📓 Captain\'s Log',
        },
        {
          type: 'docSidebar',
          sidebarId: 'archive',
          position: 'left',
          label: '📂 WSL.dev Archive',
        },
        {
          href: 'https://github.com/nunix',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Nunix Universe. Built with Bun.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['powershell', 'bash', 'yaml', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
