import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import { SlidingNumber } from "./components/animate-ui/primitives/texts/sliding-number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

interface HelloResponse {
  message: string;
}

const fetchHello = async (): Promise<HelloResponse> => {
  const res = await fetch("/api/hello");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

function App() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["hello"],
    queryFn: fetchHello,
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Kiwoom Service
        </h1>
        <SlidingNumber number={113} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={"destructive"}>hello!</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>shadcn/ui 테스트</DialogTitle>
              <DialogDescription>
                shadcn/ui Dialog 컴포넌트가 정상적으로 작동하고 있습니다! 🎉
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                이 다이얼로그는 shadcn/ui의 Dialog 컴포넌트를 사용하여
                만들어졌습니다. Radix UI를 기반으로 하며, TailwindCSS로
                스타일링되었습니다.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-blue-700 font-semibold mb-1">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              React
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              TypeScript
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              TailwindCSS
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Express
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
              pnpm
            </span>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700 font-semibold mb-1">
              에러 발생:
            </p>
            <p className="text-red-800">{error.message}</p>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-sm text-green-700 font-semibold mb-1">
              서버 응답:
            </p>
            <p className="text-green-800">{data?.message}</p>
          </div>
        )}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>모노레포 환경으로 구성되었습니다 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default App;
