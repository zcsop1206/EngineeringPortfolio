// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';


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
                  autogenerate: { directory: 'projects' },
              },
              {
                  label: 'CAD',
                  autogenerate: { directory: 'cad' },
              },
          ],
      }),
	],
	
  vite: {
    plugins: [],
  },

  site: 'https://zcsop1206.github.io',
  base: '/EngineeringPortfolio',
  output: 'static',
});

