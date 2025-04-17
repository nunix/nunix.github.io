// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://nunix.github.io',
    base: '/',
    output: 'static',
    trailingSlash: 'ignore',
    integrations: [starlight({
        title: 'The Corsair',
        logo: {
            src: './src/assets/corsair-logo.jpg',
            alt: 'The Corsair',
        },
        social: [
            { 
                icon: 'github', label: 'GitHub', href: 'https://github.com/nunix' 
            },
            { 
                icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/nunixtech' 
            },
            { 
                icon: 'blueSky', label: 'Bluesky', href: 'https://bsky.app/profile/nunix.bsky.social' 
            },
            {
                icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/ndocarmo/"
            }
        ],
        sidebar: [
            {
                label: '🐧 OS ocean 🪟',
                items: [
                    { label: 'Intro', slug: 'os/intro-os' },
                ],
            },
            {
                label: '☁️ Cloud Native ocean ☸️',
                items: [
                    { label: 'Intro', slug: 'cloud/intro-cloud' },
                ],
            },
            {
                label: '🪟 WSL ocean 🐧',
                items: [
                    { label: 'Intro', slug: 'wsl/intro-wsl' },
                ],
            },
            {
                label: '📦 Dead sea - wsl.dev',
                autogenerate: { directory: 'wsldev' },
            },
        ],
		}), mdx()],
});