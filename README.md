# Polyline Editor

## Overview
This project is a **Polyline Editor** developed as part of an **HCI (Human-Computer Interaction) lab assignment**.

The application allows users to **create, edit, and manage polylines** using mouse interaction and keyboard shortcuts, while following the **interaction design process** discussed in **Chapter 5**.

This project demonstrates how HCI principles can be applied in the design and implementation of an interactive graphical system.

---

## Objective
The main objectives of this project are to:

- Apply the **interaction design process**:
  - Requirements
  - Analysis
  - Design
  - Implementation
- Develop a **user-centered interactive system**
- Implement **direct manipulation techniques**
- Demonstrate important **HCI principles** such as:
  - Feedback
  - Visibility
  - Consistency
  - Usability
  - Learnability

---

## Tech Stack

- **HTML** – Structure of the application
- **CSS** – Styling and layout
- **JavaScript** – Interaction logic
- **Canvas API** – Drawing and editing polylines

---

## Features

### Core Functionalities
- **Begin** → Create a new polyline
- **Move** → Drag and reposition points
- **Delete** → Remove the nearest point
- **Refresh** → Redraw all polylines
- **Quit** → Disable the editor
- **Clear** → Clear the canvas

### Additional Features
- Real-time visual updates
- Sidebar-based mode selection
- Status messages and mode indicator
- Support for up to **100 polylines**

---

## User Interaction

### Mouse Controls
- **Click** → Add/select point
- **Drag** → Move point

### Keyboard Shortcuts
- **B** → Begin mode
- **M** → Move mode
- **D** → Delete mode
- **R** → Refresh canvas
- **Q** → Quit editor
- **Enter** → Finish current polyline

---

## HCI Principles Applied

- **Visibility** → Modes and available actions are clearly displayed
- **Feedback** → Immediate visual and textual responses are provided
- **Consistency** → Uniform interaction patterns are maintained
- **User Control** → Users can easily switch between modes
- **Error Prevention** → Nearest-point detection reduces mistakes
- **Direct Manipulation** → Users can drag and edit points directly
- **Learnability** → The interface is simple and intuitive for new users

---

## System Design
The application follows an **MVC-like structure**:

- **Model** → Polyline data stored as arrays of points
- **View** → Canvas rendering of points and lines
- **Controller** → Mouse and keyboard event handling

---

## Design Process

### 1. Requirements
User needs and system goals were identified clearly before implementation.

### 2. Analysis
Task analysis, and interaction flow were considered to understand how users would interact with the system.

### 3. Design
A simple and functional interface was designed with:
- Sidebar for mode selection
- Information panel for feedback
- Drawing canvas for direct interaction

---

## Confusions / Design Decisions
During development, a few interaction design questions came up:

- Should **Refresh** behave as a mode or just an action?
- How should deletion work for very small polylines?
- What is the best way to support movement:
  - Drag-based interaction
  - Click-based interaction

---

## Deployment
- **Vercel**
