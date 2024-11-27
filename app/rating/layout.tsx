import { Navigation } from "@/components/shared/Navigation";

export default function RatingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
} 