// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://nunix.github.io',
    base: '/',
    output: 'static',
    trailingSlash: 'always',
    integrations: [starlight({
        title: 'The Corsair',
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/nunix' }],
        sidebar: [
            {
                label: 'Guides',
                items: [
                    // Each item here is one entry in the navigation menu.
                    { label: 'Example Guide', slug: 'guides/example' },
                ],
            },
            {
                label: 'Reference',
                autogenerate: { directory: 'reference' },
            },
        ],
		}), mdx()],
});