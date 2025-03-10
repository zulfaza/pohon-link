# Pohon Link

A modern link-in-bio platform built with Next.js, Firebase, and Clerk authentication.

## Features

- 🔐 Secure authentication with Clerk
- 🌙 Light/dark mode support
- 🔗 Custom URL for your profile
- 📱 Fully responsive design
- 📊 Simple and intuitive dashboard

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm
- Firebase project
- Clerk account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Firebase (Server-side)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pohon-link.git
   cd pohon-link
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (public)/         # Public routes
│   ├── (dashboard)/      # Dashboard routes (authenticated)
│   ├── [customUrl]/      # Dynamic user profile pages
│   └── ...
├── components/           # React components
│   ├── ui/               # UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── ...
├── lib/                  # Utility functions and libraries
│   ├── actions.ts        # Server actions
│   ├── api.ts            # Client-side API
│   ├── firebase.ts       # Firebase configuration
│   ├── firestore.ts      # Firestore operations
│   └── ...
└── types/                # TypeScript type definitions
```

## Deployment

The easiest way to deploy your Pohon Link app is to use [Vercel](https://vercel.com/new).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
