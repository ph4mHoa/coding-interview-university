import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Idea Generator',
  description: 'Generate creative content ideas using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
