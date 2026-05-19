import { AnalyticsTracker } from "@/components/analytics-tracker";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="storefront-layout flex flex-col min-h-screen">
            <AnalyticsTracker />
            <Navbar />
            <main className="grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
