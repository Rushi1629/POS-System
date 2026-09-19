"use client";

import { useRouter } from "next/navigation";
import HomePage from "@/components/home/Home";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const router = useRouter();
   const queryClient = useQueryClient();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleRefresh = async () => {
    // Refetches active data and refreshes the page
    await queryClient.invalidateQueries();
    router.refresh();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen flex flex-col text-[#f5e6c8] px-4 relative overflow-x-hidden p-0">
        <HomePage />
      </div>
    </PullToRefresh>
  );
}
