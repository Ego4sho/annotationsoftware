import { Navigation } from "@/components/shared/Navigation";

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#1A1A1A]">
      <Navigation />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
} 