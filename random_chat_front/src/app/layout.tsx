import type { Metadata } from "next";
import localFont from "next/font/local";
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import StoreProvider from "./StoreProvider";
import { SocketProvider } from "./contexts/SocketContext";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

      <NextUIProvider>
        <SocketProvider >
          {children}
        </SocketProvider>
      </NextUIProvider>
      </body>
    </html>
    </StoreProvider>
    
  );
}
