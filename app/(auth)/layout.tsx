import React from "react";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import '../globals.css';

// Set Font Alphabet
const inter = Inter({
    subsets: ['latin']
});

// Set Metadata
export const metadata: Metadata = {
    title: 'Authentification - Minerva',
    description: "Build Quizzes using AI",
    keywords: ['Minerva', 'Quizzes','AI','Chat-GPT','Education' ],
    authors: [{name: 'Opkar'}, {url: 'www.opkarghadu.com'}],  
  }

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}){
    return(
        // Allows us to use Clerk Functions 
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}