# Atemzy Hitech Engineering Services Ltd — Corporate Web Platform

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-Commercial%20Proprietary-blue)](LICENSE)

Official corporate web portal for **Atemzy Hitech Engineering Services Ltd** (`RC-7092143`), a premier multidisciplinary engineering, building construction, technical procurement, real estate, and commercial trading firm headquartered in Victoria Island, Lagos, Nigeria.

---

## 🌟 Platform Highlights

- **3D Interactive Orbiting Earth Canvas**: High-fidelity WebGL 3D planet Earth featuring sculpted ribbon clouds, unlit shaders, atmospheric starfield particles, and fluid user OrbitControls powered by Three.js.
- **Dynamic Theming System**: Seamless Dark and Light theme switcher with persistent local state, fine-tuned contrast ratios, and accessible color tokens.
- **Enterprise Service Showcase**: In-depth capability guides for Civil & Structural Engineering, Building Construction, Technical Procurement, Real Estate Facilities, and Commercial Trading.
- **Multi-Step Quotation & BOQ Estimator**: Client quotation calculator with scope specifications, timeline requirements, and budget parameter selection.
- **Direct Communication Desk**: Secure serverless inquiry transmission via Web3Forms with client validation, honeypot spam protection, and Google Maps integration.
- **Data Protection & Legal Governance**: Full compliance with the Nigeria Data Protection Act (NDPA / NDPR), detailing data handling, intellectual property confidentiality, and non-disclosure standards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19 (`react`, `react-dom`), React Router DOM v7 |
| **Build Tooling** | Vite 8, `@vitejs/plugin-react` |
| **Styling & Design System** | TailwindCSS v4 (`@tailwindcss/vite`), Vanilla CSS, Plus Jakarta Sans |
| **3D & Visualization** | Three.js (`three` r185), `GLTFLoader`, `OrbitControls` |
| **Icons & Visuals** | Lucide React (`lucide-react`) |
| **Form Processing** | Web3Forms Serverless Encrypted API Forwarding |

---

## 📁 Repository Structure

```text
corporateWeb/
├── public/
│   ├── favicon.ico             # App browser icon
│   ├── favicon.png             # Fallback PNG favicon
│   ├── logo-1.png              # Official rounded Atemzy Hitech circular logo
│   ├── scene.webm              # High-definition construction hero backdrop video
│   ├── planet/                 # 3D WebGL Earth Asset Bundle
│   │   ├── scene.gltf          # GLTF 3D scene descriptor
│   │   ├── scene.bin           # 3D vertex mesh & ribbon cloud geometry
│   │   └── textures/           # High-resolution unlit baseColor textures
│   │       ├── Clouds_baseColor.png
│   │       └── Planet_baseColor.png
│   └── _redirects              # SPA routing rules for static hosting (Netlify/Cloudflare)
├── src/
│   ├── assets/                 # Component-level static media
│   ├── components/
│   │   ├── canvas/             # Three.js 3D WebGL Canvas implementations
│   │   │   ├── Earth.jsx       # 3D Rotating Earth with OrbitControls
│   │   │   ├── Stars.jsx       # 3D Galaxy background starfield
│   │   │   └── index.js
│   │   ├── cards/              # Corporate & Brutalist feature card components
│   │   ├── forms/              # Input fields, captcha alerts, and validation widgets
│   │   └── layout/             # Navbar, Footer, Mobile Drawer, Theme Switcher
│   ├── context/
│   │   └── ThemeContext.jsx    # Global Light/Dark mode state management
│   ├── data/
│   │   ├── company.js          # Canonical corporate information, RC number & contacts
│   │   ├── services.js         # Engineering capabilities & technical scopes
│   │   └── projects.js         # Completed infrastructure case studies & metrics
│   ├── hooks/
│   │   └── useFormSubmit.js    # Web3Forms API submission and status handling
│   ├── pages/
│   │   ├── Home.jsx            # Main corporate landing page with video hero
│   │   ├── About.jsx           # Leadership, governance, mission & vision
│   │   ├── Services.jsx        # Service portfolio & delivery methodologies
│   │   ├── Projects.jsx        # Verified portfolio & categorized case studies
│   │   ├── RequestQuote.jsx    # Quotation calculator & specification builder
│   │   ├── Contact.jsx         # Contact desk with 3D Earth canvas & office details
│   │   ├── PrivacyPolicy.jsx   # NDPA-compliant data handling & privacy policy
│   │   └── NotFound.jsx        # Interactive 404 error page
│   ├── utils/
│   │   └── validation.js       # Client-side form sanity and input validators
│   ├── App.jsx                 # Route declarations & layout shell
│   ├── index.css               # Core styling tokens, utility classes & 3D buttons
│   └── main.jsx                # Application root entry point
├── .env.example                # Example environment variable template
├── package.json                # Project dependencies and operational scripts
└── vite.config.js              # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Recommended: LTS v20+)
- **npm**: `v9.0.0` or higher

### 1. Installation

Clone or open the project folder in your terminal and navigate to `corporateWeb`:

```bash
cd corporateWeb
npm install
```

### 2. Environment Configuration

Create a `.env` file from the provided example template:

```bash
cp .env.example .env
```

Set your Web3Forms access key for live form dispatch:

```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
```

*(If no key is configured, the application operates in safe development mock mode with simulated successful submission).*

### 3. Running the Development Server

Execute the development server locally:

```bash
npm run dev
```

Alternatively, from the workspace root directory on Windows, launch the one-click server script:

```bat
run-app.bat
```

Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 📦 Building for Production

To create an optimized, minified production distribution bundle:

```bash
npm run build
```

Preview the production build locally before deployment:

```bash
npm run preview
```

The compiled assets will be placed in the `corporateWeb/dist/` directory, ready to deploy to Vercel, Netlify, Cloudflare Pages, AWS S3, or any static HTTP web server.

---

## 🌐 3D Canvas Asset Notes

The 3D Earth model is stored statically under `/public/planet/` and consists of:
- `scene.gltf`: Stylized planet model with `KHR_materials_unlit` shader extensions.
- `scene.bin`: Binary vertex, normal, and UV buffer data (1.65 MB).
- `textures/`: Unlit baseColor textures for clouds and planetary continents.

The Three.js canvas dynamically mounts in [`src/components/canvas/Earth.jsx`](file:///c:/Users/dooli/OneDrive/Desktop/AtemzyHitech/corporateWeb/src/components/canvas/Earth.jsx) and automatically renders with smooth horizontal orbit rotation, ACES Filmic tone mapping, and sRGB color space reproduction.

---

## 🏛️ Corporate Governance & Legal

- **Entity**: Atemzy Hitech Engineering Services Ltd
- **Registration**: Incorporated under the Companies and Allied Matters Act (`RC-7092143`)
- **Headquarters**: Plot 12, Commercial Central Hub, Victoria Island, Lagos, Nigeria
- **Direct Desk**: `info@atemzyhitech.com` | `projects@atemzyhitech.com`
- **Telephone**: `+234 803 000 0000`

---

© 2026 Atemzy Hitech Engineering Services Ltd. All rights reserved.
