"use client";

import { z } from "zod";
import { adminLoginSchema } from "@/schemas/adminLogin";
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react"; // Import useState

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Note: This is now the default export for the page
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // To show login errors
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });
  
  // This is the new, secure onSubmit function
  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success! The cookie is set. Redirect to the admin page.
        router.push("/admin");
      } else {
        // Show error message from the API
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="admin"
                      className="h-12 px-4 text-base border-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-12 px-4 text-base border-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Show an error message if login fails */}
            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="flex gap-2 w-full">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}