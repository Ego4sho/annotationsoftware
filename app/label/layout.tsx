import { Navigation } from "@/components/shared/Navigation";

export default function LabelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black">
      <Navigation />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
} 