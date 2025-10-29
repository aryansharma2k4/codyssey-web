"use client";

import { z } from "zod";
import { adminLoginSchema } from "@/schemas/adminLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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


export default function AdminLoginForm() {
    const form = useForm<z.infer<typeof adminLoginSchema>>({
      resolver: zodResolver(adminLoginSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    });
  
    function onSubmit(values: z.infer<typeof adminLoginSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values);
    }
  
    return (
      <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex gap-2 w-full">
  
              <Button type="submit">
                Login
              </Button>
  
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    );
  }
  