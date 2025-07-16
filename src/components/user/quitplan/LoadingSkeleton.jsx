import { Card, Skeleton } from "antd";

const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="p-8 shadow-lg rounded-lg w-full max-w-6xl">
      <Skeleton.Input active size="large" className="w-96 h-12 mx-auto mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} loading className="rounded-lg border-0 shadow-lg h-96" />
        ))}
      </div>
    </Card>
  </div>
);

export default LoadingSkeleton;
