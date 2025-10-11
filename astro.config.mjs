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
                  items: [
                    { label: 'Hand tremor stabilization in Neurosurgery (NeuroHack 2025)', link: '/projects/neurosteady' }
                    // add more projects
                  ],
              },
              {
                  label: 'CAD',
                  items: [
                    { label: 'My 3D Model Post', link: '/cad/example' }
                    // add more projects
                  ],
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

