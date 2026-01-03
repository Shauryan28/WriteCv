# Write CV

A minimalist, Notion-style web app that generates ATS-friendly LaTeX resumes.

## Features
- **Minimalist UI**: Clean, distraction-free interface.
- **Real-time Form**: Easy input for Experience, Projects, Education.
- **LaTeX Backend**: Generates high-quality PDF resumes using `pdflatex`.
- **ATS Friendly**: Uses a standard, clean LaTeX template structure.

## Prerequisites
1.  **Node.js**: Needed to run the app.
2.  **LaTeX Distribution**: You **MUST** have `pdflatex` installed and in your system PATH.
    -   **Windows**: Install [MiKTeX](https://miktex.org/download) or [TeX Live](https://www.tug.org/texlive/).
    -   **Mac**: Install [MacTeX](https://tug.org/mactex/).
    -   **Linux**: `sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-extra-utils`.

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the App**:
    You need to run both the backend and frontend.

    **Terminal 1 (Backend)**:
    ```bash
    node server.js
    ```

    **Terminal 2 (Frontend)**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Go to [http://localhost:5173](http://localhost:5173).

## Troubleshooting
-   **PDF Generation Failed**: Ensure `pdflatex` is installed. Open a terminal and type `pdflatex --version` to check.
-   **Styles not loading**: Ensure the frontend server is running.
