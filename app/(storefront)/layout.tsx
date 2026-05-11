
export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="storefront-layout">
            {children}
        </div>
    );
}
