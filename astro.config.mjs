// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
          title: 'Adit Bhargava - Engineering Portfolio',
		  customCss: [
	        // Path to your Tailwind base styles:
    	    './src/styles/global.css'
		  ],
          social: [{icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/adit-bhargava-29509a200'}, { icon: 'github', label: 'GitHub', href: 'https://github.com/zcsop1206' }],
          sidebar: [
              {
                  label: 'Projects',
                  autogenerate: { directory: 'Projects' },
              },
              {
                  label: 'CAD',
                  autogenerate: { directory: 'CAD' },
              },
          ],
      }),
	],
	
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://zcsop1206.github.io',
  base: '/EngineeringPortfolio/',

});

