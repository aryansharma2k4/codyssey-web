"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const fetchContestLink = async () => {
    try {
      const res = await fetch("/api/contestLink", { method: "GET" });

      // Handle 404 and non-OK responses
      if (!res.ok) {
        if (res.status === 404) {
          console.error("API endpoint not found (404)");
          return;
        }
        console.error(`Error: ${res.status} ${res.statusText}`);
        return;
      }

      const data = await res.json();

      if (data.success && data.contestLink) {
        router.push(data.contestLink);
      } else {
        console.error("API response missing success or contestLink:", data);
      }
    } catch (err) {
      console.error("Failed to fetch contest link:", err);
    }
  };

  useEffect(() => {
    fetchContestLink();
  }, []);

  return <div>Redirecting you to the contest...</div>;
};

export default Page;
