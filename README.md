## Novara Labs – Research Peptides Catalog

This repository contains the marketing and catalog site for Novara Labs research peptides. It is a React + Vite single-page application with product listing, product detail pages, and an inquiry workflow.

### Features

- **Peptides catalog**: Browse all peptides on the `/peptides` page.
- **Product detail pages**: Each peptide has a dedicated page (`/peptides/:slug`) with full description, size, and pricing.
- **Related products**: Detail pages surface related compounds for easier exploration.
- **Inquiry flow**: A consistent “Send Inquiry” modal is available from cards and product pages.

### Run Locally

**Prerequisites:** Node.js (LTS recommended), npm

1. Install dependencies:  
   `npm install`
2. Start the development server:  
   `npm run dev`
3. Open the URL printed in the terminal (usually `http://localhost:5173`).

### Build for Production

To create an optimized production build:

```bash
npm run build
```

You can preview the production build locally with:

```bash
npm run preview
```
