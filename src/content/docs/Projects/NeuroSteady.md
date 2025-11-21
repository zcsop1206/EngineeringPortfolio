---
title: Hand tremor stabilization in Neurosurgery (NeuroHack 2025)
description: "Engineered a closed-loop hand tremor mitigation system: real-time transfer learning model to detect tremors and servo-based actuators to counteract them. Achieved 76% tremor reduction in simulated neurosurgeries."
date: 2025-02-01
featured: true
tags:
github: https://github.com/supreme-gg-gg/NeuroSteady
award: Placed top 3 overall and won 'Best Prototype' award at NeuroHack 2025
tech stack:
---
# Story
At NeuroHack2025 at the University of Toronto, we were tasked with making the surgical environment safer through more robust surgical instruments. We decided to make a hand tremor stabilizer for nervousness-induced tremors in surgeons. In hindsight this is not really a problem making the operating room unsafe, but I am proud of the end-to-end working prototype my team was able to design.
>Our design won best Prototype and placed in the Top 3 at the event.
# Method and Solution
We adapted our design process to prioritize flexibility and rapid prototyping over conceptual design given the constrained time frame and limited resources we were given. We decided to structure our design process around two core specifications: minimizing cost, ensuring biocompatibility and seamless integration with surgical attire. We split our design into three phases: data acquisition, tremor detection, and tremor stabilization. The below figure highlights the proposed design we came up with after executing the design process.
![overview](overview.png)
## Data acquisition
We used an MPU6050 as our accelerometer placed on the back of the user's hand in a wearable glove. It gave kinematic data of the user's hand as input for our tremor detection phase. We used this [Hand Tremor Dataset](https://www.kaggle.com/datasets/aaryapandya/hand-tremor-dataset-collected-using-mpu9250-sensor) for transfer learning, so we tried to mirror the data acquisition techniques to those used by the dataset as far as possible.
## Tremor detection
### Dataset selection for few-shot transfer learning
We chose a Parkinson's disease tremor dataset due to its relative availability compared to tremors in the operating room, and relative similarities with our application. Some differences we thought might be challenges to its use for few-shot transfer learning were different accelerometers used (MPU9250 vs MPU6050) and subtle differences in the tremor profile. 

To test the viability of this proposed approach, we created a custom dataset by simulating tremors and collecting them using our accelerometer with an Arduino. Using t-distributed Stochastic Neighbor Embedding (see figure below), a technique used to visualize high dimensional data, we concluded that source domain and target domain are close to each other despite the limitations. This confirmed the viability of few-shot transfer learning.

![tsne-lstm](tsne-lstm.png)

### Model architecture
We implemented a Convoluted Neural Network - Long Short-Term memory (CNN-LSTM) architecture with a few-shot transfer learning approach. We chose a 1D CNN due to its ability to extract features from the time series data and an LSTM since we needed capture the temporal dependencies in the sequential tremor data. The feature mapping extracted from the CNN-LSTM layers overlapped significantly between the Parkinson's disease dataset and our custom dataset, further supporting the viability of few-shot transfer learning. Therefore, we decided to only fine-tune the feed forward layers of the model on the custom dataset and freeze the CNN-LSTM layers derived from training on the Parkinson's disease dataset. This decision was also supported by the disparity in the sizes of the Parkinson's disease dataset and our custom dataset. The below figure shows the working of the model allowing it to classify the user's hand movements as tremors.

![model](cnnlstm.png)

The base model achieved an accuracy of 85% with minor manual optimization and little overfitting. The final accuracy obtained on our own dataset in 78% in 50 epochs. This is without any data augmentation or other techniques to improve the model. For improvement, explicit feature engineering is needed that has been shown in literature to achieve 80-90% accuracy for Parkinson's disease tremors. Due to our time and resource constraints, we decided not to implement this. The below figure shows the performance statistics of our model.

![stats](stats.png)

This model is then ensembled with a simple majority voting system with a sliding window time-frequency analysis. The model is run on the windowed data and the majority vote is taken. This helped us reduce the false positives and false negatives, given that the CNN-LSTM model is not perfect and quite sensitive to the input data, while traditional signal processing methods are not sensitive enough but are robust.

## Tremor Stabilization
This phase was highly constrained by our limited resources, since we only had access to an Arduino starter kit. Our model inference had to run on a laptop as a result, confining the range of motion of our design which had to be connected to the laptop. Despite this constraint, we stabilized the tremor along 1 degree of freedom - the up and down motion of the wrist as this tremors along this axis can cause the most damage during surgery. This was done through a wearable glove and sleeve mechanism. The majority vote from our tremor detection model, when above a threshold, triggered servos on top and bottom of the sleeve placed on the forearm. This put the arm in tension through strings tied to the glove and the servos, dampening the tremors until they stopped. The servo then returned to its original position, leaving the string in slack until the tremors began again. The figure below shows the hardware enabling tremor stabilization.

![device](device.png)

# Solution
Our design used an MPU6050 accelerometer to collect the user's hand movement data. It was also used to create a custom dataset for few-shot transfer learning with the Parkinson's disease dataset for tremor detection. The tremor detection used these datasets in a CNN-LSTM architecture, the Parkinson's disease dataset being used to train the model and our custom dataset being used to finetune it. This model was then ensembled with a simple majority voting system and a sliding window time-frequency analysis to balance the sensitivity and robustness of our model. The classification was then used to stabilize tremors by putting the hand in string tension using servo motors in our wearable system.
# Extension
## Data acquisition
- [ ] Improve the latency of receiving and processing the signal
## Tremor detection
- [ ] Improve the model with explicit feature engineering as carried out in literature
- [ ] Train 2D CNN on spectrogram data for better feature extraction
- [ ] Improve the time series model and ensemble with other techniques such as bagging or boosting to leverage the strength and weaknesses of different models
- [ ] Evaluate the trained models using 10-fold cross validation
## Tremor stabilization
- [ ] Migrate the model onto the microcontroller unit using TinyML
- [ ] Create a CAD housing and Flex PCB to ensure the design can integrate with surgical attire
- [ ] Use piezoelectric actuation using smart fabric for easier personalization, more precise and multi-degree of freedom dampening of tremors
# Teamwork and my role