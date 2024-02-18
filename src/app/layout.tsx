import { Room } from '@/app/Room';
import type { Metadata } from 'next';
import { Inter, Work_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const workSans = Work_Sans({
	subsets: ['latin'],
	variable: '--font-work-sans',
	weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Figma clone',
	description: 'Figma Clone using fabric.js and liveblocks for real-time collaboration',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${workSans.className} bg-primary-grey-200`}>
				<Room>{children}</Room>
			</body>
		</html>
	);
}
