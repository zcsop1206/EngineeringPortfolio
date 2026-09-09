import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeMathJax from 'rehype-mathjax';


export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJax],
  },
  integrations: [
      starlight({
          title: 'Adit Bhargava - Engineering Portfolio',
		  customCss: [
	        // Path to your Tailwind base styles:
    	    './src/styles/global.css',
          './src/mathjax.css'
		  ],
          social: [{icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/adit-bhargava-29509a200'}, { icon: 'github', label: 'GitHub', href: 'https://github.com/zcsop1206' }],
          sidebar: [
              {
                  label: 'Built and tested',
                  items: [
                    { label: 'CACT: copper condenser for a wickless flat-plate heat pipe', link: '/projects/cact' },
                    { label: 'OpenVinyl: 3D-printed audio records and turntable', link: '/projects/openvinyl' },
                    { label: 'NeuroTech UofT: compliant tendon-driven finger joint', link: '/projects/poststrokerehab' },
                    { label: 'MIE243: optimized 3D-printed 3:1 speed reducer', link: '/projects/gearbox' },
                    { label: 'NeuroHack 2025: hand tremor stabilizer', link: '/projects/neurosteady' },
                  ],
              },
              {
                  label: 'Jane Street ASIC puzzle',
                  items: [
                    { label: 'Part 1: reverse engineering the chip from its GDS', link: '/projects/asicpuzzle2026' },
                    { label: 'Part 2: what the chip computes', link: '/projects/asicpuzzle2026-starbattle' },
                  ],
              },
              {
                  label: 'Analysis and design studies',
                  items: [
                    { label: 'MIE243: 4-DOF camera manipulator', link: '/projects/cameramanipulator' },
                    //{ label: 'EEG controller', link: '/projects/eegcontroller' },
                  ]
              },
              //{
                  //label: 'CAD',
                  //items: [
                  //  { label: 'My 3D Model Post', link: '/cad/example' }
                    // add more projects
                  //],
              //},
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

