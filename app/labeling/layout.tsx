import { Navigation } from "@/components/shared/Navigation";

export default function LabelingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
} 