import type { Metadata } from "next";
import {manrope, playfair, raleway, unbounded} from "@/app/fonts";
import Header from "@/app/components/Header/Header";
import {Footer} from "@/app/components/Footer/Footer";
import {SiteContentProvider} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {isAdminSession} from "@/lib/adminAuth";
import {getSiteContent} from "@/lib/siteContent";
import type {HeaderConfig} from "@/types/header";
import "./globals.css";

export const generateMetadata = async (): Promise<Metadata> => {
    const siteContent = await getSiteContent();

    return {
        title: siteContent.metadata.title,
        description: siteContent.metadata.description,
        icons: {
            icon: [
                {url: "/favicon.ico", sizes: "16x16 32x32 48x48"},
                {url: "/icon.png", type: "image/png", sizes: "312x312"},
            ],
            shortcut: "/favicon.ico",
            apple: [{url: "/icon.png", type: "image/png", sizes: "312x312"}],
        },
    };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isAdmin, siteContent] = await Promise.all([
        isAdminSession(),
        getSiteContent(),
    ]);
    const headerConfig: HeaderConfig = {
        title: siteContent.brand.contentfulTitle,
        headerButtons: [
            {url: "/", label: siteContent.navigation.headerButtons.shop, iconName: "shop"},
            {url: "/wishlist", label: siteContent.navigation.headerButtons.wishlist, iconName: "wishlist"},
            {url: "/cart", label: siteContent.navigation.headerButtons.cart, iconName: "cart"},
        ],
    };

    return (
    <html lang="uk">
        <body
            className={`${unbounded.variable} ${playfair.variable} ${raleway.variable} ${manrope.variable} vitan-app-body antialiased`}
        >
            <SiteContentProvider content={siteContent}>
                <div className="bg-layer" aria-hidden="true" />
                <Header config={headerConfig} />
                <div className="vitan-app-main">{children}</div>
                <Footer isAdmin={isAdmin} />
            </SiteContentProvider>
        </body>
    </html>
    );
}
