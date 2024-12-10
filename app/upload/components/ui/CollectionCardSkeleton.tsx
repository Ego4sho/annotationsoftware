import { Card, CardContent } from "@/components/ui/card";

export const CollectionCardSkeleton = () => {
  return (
    <Card className="bg-[#262626] border-[#604abd] p-4 relative">
      <CardContent className="space-y-4 p-0">
        <div>
          <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-700 rounded mt-2 animate-pulse" />
          <div className="h-3 w-1/3 bg-gray-700 rounded mt-2 animate-pulse" />
        </div>

        <div className="space-y-1">
          <div className="h-4 w-1/4 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-1/4 bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          {['labeling', 'rating', 'validated'].map((category) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="h-3 w-1/4 bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gray-600 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 