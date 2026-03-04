# LetsWorkOut

A Next.js 14 workout companion application built with TypeScript, Tailwind CSS, and modern web technologies.

## Project Setup

This project was created with the following specifications:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- ESLint
- shadcn/ui components
- Supabase integration
- State management with Zustand
- Chart library: Recharts
- UI library: Lucide React
- Anthropic SDK for AI features

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

If npm install didn't complete due to network restrictions, run:

```bash
npm install
```

This will install all dependencies including:
- Core: react, react-dom, next
- Database: @supabase/supabase-js, @supabase/ssr
- State: zustand
- UI: recharts, lucide-react, @shadcn/ui
- Utilities: class-variance-authority, clsx, tailwind-merge
- AI: @anthropic-ai/sdk

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/              (shadcn/ui components)
└── lib/
    └── utils.ts

Configuration Files:
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .eslintrc.json
└── components.json
```

## Adding shadcn/ui Components

When npm is available, add shadcn/ui components:

```bash
npx shadcn@latest init --defaults --yes
npx shadcn@latest add button input label card form select textarea badge tabs separator avatar dropdown-menu dialog sheet toast progress skeleton
```

## Environment Variables

Create a `.env.local` file with your configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Database**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Anthropic SDK
- **Linting**: ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [Zustand](https://github.com/pmndrs/zustand)

## License

This project is private.
