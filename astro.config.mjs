// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTailwind from '@astrojs/starlight-tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Adit Bhargava - Engineering Portfolio',
      plugins: [starlightTailwind()],  // Add Tailwind plugin here
      customCss: [
        './src/styles/global.css'
      ],
      social: [
        {icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/adit-bhargava-29509a200'}, 
        {icon: 'github', label: 'GitHub', href: 'https://github.com/zcsop1206'}
      ],
      sidebar: [
        {
          label: 'Projects',
          autogenerate: { directory: 'projects' },  // lowercase
        },
        {
          label: 'CAD',
          autogenerate: { directory: 'cad' },  // lowercase
        },
      ],
    }),
  ],

  site: "https://zcsop1206.github.io",
  base: "/EngineeringPortfolio/",
});