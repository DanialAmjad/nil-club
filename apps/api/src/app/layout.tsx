import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NIL Club API',
  description: 'API for NIL Club athlete earnings platform',
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
