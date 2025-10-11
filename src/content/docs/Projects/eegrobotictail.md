---
title: EEG-controlled robotic tail
description: EEG classified for stop-start motion, ~5 DOF tail
date: 2025-10-01
featured: true
tags:
github:
award:
tech stack:
---

## EEG placement
https://pmc.ncbi.nlm.nih.gov/articles/PMC7877609/#sec013
https://www.acns.org/UserFiles/file/EEGGuideline3Montage.pdf
hunch - placement should be function dependent - sleep health addresses sleep health relevant regions, actuation relevant addresses actuation relevant

## PCB
### Function: transmitting EEG signals obtained from electrodes to device suitable for signal processing

### Objectives
Hidden assumption - PCB needs to be on wearable device - wireless.

| Objective                                           | Metric                           | Rationale                                                                    | measurement                                                                                                              |
| --------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| signal to noise ratio (SNR) - external and internal | -3.78 dB                         | BR8+ benchmark - dry EEG                                                     | https://pmc.ncbi.nlm.nih.gov/articles/PMC5817086/, solution oriented (https://pmc.ncbi.nlm.nih.gov/articles/PMC5967739/) |
| common mode rejection ratio (CMRR)                  | 110 dB                           | ADS1299 CMRR - try not to reduce further                                     | as i understand it, CMRR is only dependent on the differential amplifier, but                                            |
| wearability                                         | Planar area, Thickness, flexible | may be included in wearable device that needs to be worn for extended period | design consideration if PCB needs to be attached to wearable device, design can be altered according to needs.           |
### Constraints
| Constraints          | Metric          | Rationale             | measurement                                          |
| -------------------- | --------------- | --------------------- | ---------------------------------------------------- |
| Cost                 | lower than 200$ | budgetary             | quote requested before purchase                      |
| Temperature          | lower than 43 C | must not burn sleeper | cannot be measured before operation, use methods and |
| Must use RPI Zero 2W | have it         | budgetary             | not a constraint for wearable - too bulky            |
| ADS1299              | have it         | budgetary             |                                                      |
| Dry flat electrodes  | have it         | budgetary             |                                                      |
## PCB toolkit
- Multilayer
- Aluminum/ceramic
- flex PCBs / Rigid-flex PCBs
- HDI (high density interconnector)
	- ELIC (every layer interconected)
- FOWLP (fan out wafer level packaging)
- SLP (substrate like)
## ADS1299

| sequential montage | referential montage |
| ------------------ | ------------------- |
|                    |                     |

## Candidate designs:
Common components: ADS1299, 4 dry flat electrodes, OpenBCI compatible pins
### Wearable integrated PCB:
flex pcb
key consideration - noise from components decreasing SNR
#### Components:
- MCU: https://www.microchip.com/en-us/products/microcontrollers
- communication
- power supply and management
- debugging support
### Non-integration with wearable
regular pcb
#### Components:
- RPI Zero 2W
- power supply and management
- debugging support
## Design process
### circuit design
- specs: inputs and outputs
- packaging: individual parts
- packaging of all parts
- pricing & availability
### schematic capture
- design circuit first, then design it for computer interpretation
### board layout
- component layout -  place stuff that need to be close to each other close to each other
- routing - connecting components using copper traces
- design rule check - automatic
- gerber generation - printing form 
### fabrication and assembly
- apply solder paste where you want
- place parts
- reflow
### debugging