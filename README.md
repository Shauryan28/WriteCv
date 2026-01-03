# 📝 Write CV. (Hand-Drawn Edition)

> **A beautiful, hand-drawn resume builder ensuring your CV stands out from the corporate gray.**

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Overview

**Write CV.** is a unique resume builder application that breaks away from standard, boring form inputs. It features a playful, **Glassmorphic Hand-Drawn UI** that feels like sketching in a notebook, but generates **professional, Ats-friendly PDFs** ready for job applications.

The project combines a high-fidelity frontend design with a robust backend PDF generation engine using **Puppeteer**, ensuring what you see is what you get—but better.

---

## 🎨 Design Philosophy

*   **Glassmorphism**: Frosted glass panels (`backdrop-filter: blur`) effectively layer content over a dynamic background.
*   **Hand-Drawn Aesthetic**: Custom handwritten fonts (**Patrick Hand**, **Architects Daughter**), "wobbly" borders, and sketch-like icons create a human touch.
*   **Interactive Elements**: "Rubber stamp" buttons, spotlight cursor effects, and floating background blobs bring the interface to life.

---

## 🚀 Key Features

*   **Spiral Notebook Interface**: Build your resume section by section in a digitized notebook environment.
*   **Real-time PDF Generation**:
    *   Uses **Puppeteer (Headless Chrome)** to render pixel-perfect PDFs from HTML/CSS.
    *   Supports custom styling, layout, and typography that beats standard PDF generation libraries.
*   **Smart Form Handling**: dynamic inputs for Experience, Education, Projects, and Skills.
*   **Direct Download**: One-click "Rubber Stamp" prints your CV directly to your device.
*   **Global Spotlight & Animations**: A mouse-following spotlight reveals a "wall of words" in the background.

---

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Fast, modern UI library.
*   **Tailwind CSS**: Utility-first styling with custom config for "sketch" fonts and animations.
*   **Framer Motion**: Smooth animations for page transitions and interactive elements.
*   **React Router**: client-side routing.

### Backend
*   **Node.js & Express**: Simple REST API handling.
*   **Puppeteer**: Chrome-based PDF generation for high-quality output.
*   **Cors & Body-Parser**: Middleware for secure data handling.

---

## 💻 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shauryan28/WriteCv.git
    cd WriteCv
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies** (if not automatically installed)
    ```bash
    npm install express puppeteer cors body-parser
    ```

4.  **Run the Project**
    You need two terminals running simultaneously:

    *   **Terminal 1 (Frontend)**:
        ```bash
        npm run dev
        ```
    *   **Terminal 2 (Backend)**:
        ```bash
        node server.js
        ```

5.  **Open in Browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

---

## 📸 Screenshots

*(Add screenshots of your "Start Here" page, the "Chapters" sidebar, and the generated PDF here!)*

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

<p align="center">
  Made with ❤️ by Shaur
</p>
