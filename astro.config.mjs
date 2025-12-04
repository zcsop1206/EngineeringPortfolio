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
                  label: 'Completed projects',
                  items: [
                    { label: 'MIE243: Camera manipulator robot', link: '/projects/cameramanipulator' },
                    { label: 'MIE243 dissection: 90 degree speed reducer', link: '/projects/gearbox' },
                    { label: 'NeuroHack 2025: Hand tremor stabilization in Neurosurgery', link: '/projects/neurosteady' },
                    //{ label: 'EEG-controller', link: '/projects/eegcontroller' }
                    // add more projects
                  ],
              },
              //{
              //    label: 'Ongoing projects',
              //    items: [
                    //{ label: 'EEG controller', link: '/projects/eegcontroller' },
                    //{ label: 'NeuroTech Fall 2025: sEMG + exoskeleton for hand rehabilitation', link: '/projects/poststrokerehab' },
              //    ]
              //}
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

