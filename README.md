# Kasvior Wallet App

![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=fff)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?style=for-the-badge&logo=redux&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-5.0.12-443E38?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

![Kasvior wallet preview](./public/money-wallet-black.png#gh-light-mode-only)
![Kasvior wallet preview](./public/money-wallet.png#gh-dark-mode-only)

## Project Description

Kasvior Wallet App is a modern e-wallet frontend application for managing digital wallet activities. It provides user authentication, wallet balance information, top up, money transfer, transaction history, transaction reports, and profile management through a responsive fintech interface.

The application is built with React and Vite, uses Redux Toolkit and Zustand for state management, and communicates with the backend API through Axios.

## Technology Stack

![React](https://img.shields.io/badge/React-Frontend_Library-61DAFB?style=flat-square&logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-Global_State-764ABC?style=flat-square&logo=redux&logoColor=fff)
![React Redux](https://img.shields.io/badge/React_Redux-State_Binding-764ABC?style=flat-square&logo=redux&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-Local_State-443E38?style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-Routing-CA4245?style=flat-square&logo=reactrouter&logoColor=fff)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=flat-square&logo=axios&logoColor=fff)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-Forms-EC5990?style=flat-square&logo=reacthookform&logoColor=fff)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22B5BF?style=flat-square)
![ESLint](https://img.shields.io/badge/ESLint-Code_Linting-4B32C3?style=flat-square&logo=eslint&logoColor=fff)
![Prettier](https://img.shields.io/badge/Prettier-Code_Formatting-F7B93E?style=flat-square&logo=prettier&logoColor=000)

## Features

- User registration, login, logout, forgot password, and reset password
- Protected dashboard routes for authenticated users
- Wallet balance and transaction report overview
- Money transfer flow with receiver search and PIN confirmation
- Top up flow with payment method selection
- Transaction history with search and pagination
- Profile update, password update, and PIN update
- Responsive landing page and dashboard UI
- Toast notification and loading state handling
- API integration using configurable environment variables

## Prerequisites

Before running this project locally, make sure you have:

- Node.js 20 or newer
- npm
- Git
- Running backend API for the wallet service

## Setup Instruction

Clone the repository:

```bash
git clone https://github.com/anggavb/kasvior-wallet-app.git
```

Move into the project directory:

```bash
cd kasvior-wallet-app
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Configure the environment variables in `.env`:

```env
VITE_ENV=development
VITE_APP_TITLE=Kasvior Wallet App
VITE_API_BASE_URL=http://localhost:3000/api
```

Run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

This project follows a Atomic Design pattern, separating concerns into different layers. You can read more about it [here](https://atomicdesign.bradfrost.com/). The main directories are:
```bash
.
├── public/                 # Static assets
├── src/
│   ├── assets/             # Application images and asset exports
│   ├── components/         # Reusable UI components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Route layouts and protected route wrapper
│   ├── pages/              # Public and authenticated pages
│   ├── redux/              # Redux store, slices, and API helpers
│   ├── utils/              # Utility functions and constants
│   ├── zustand/            # Zustand stores
│   ├── AppRouter.jsx       # Application route definitions
│   ├── globals.css         # Global styles
│   └── main.jsx            # Application entry point
├── nginx/                  # Nginx configuration for container deployment
├── Dockerfile              # Docker build configuration
├── package.json            # Scripts and dependencies
├── vite.config.js          # Vite configuration
└── vercel.json             # Vercel deployment configuration
```

## How to Contribute

1. Fork this repository.
2. Create a new feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Install dependencies and run the project locally.
4. Make your changes.
5. Run linting before submitting.

```bash
npm run lint
```

6. Commit your changes with a clear message.

```bash
git commit -m "Add your feature"
```

7. Push your branch and open a pull request.

```bash
git push origin feature/your-feature-name
```

## Related Project

- [Kasvior Wallet App Frontend](https://github.com/anggavb/kasvior-wallet-app)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
