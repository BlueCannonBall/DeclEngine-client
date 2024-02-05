import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
    weight: "400",
    subsets: ["latin"]
});

export const metadata = {
    title: "DeclEngine",
    description: "Provides information about Latin words.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={poppins.className}>{children}</body>
        </html>
    );
}
