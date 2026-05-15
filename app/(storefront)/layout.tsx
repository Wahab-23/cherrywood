
import { AnalyticsTracker } from "@/components/analytics-tracker";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="storefront-layout">
            <AnalyticsTracker />
            {children}
        </div>
    );
}
