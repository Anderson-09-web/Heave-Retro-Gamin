import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuthLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gamepad2, Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const login = useAuthLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          setLocation("/admin");
        },
        onError: () => {
          setError("Invalid credentials");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-border shadow-2xl bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-2 flex flex-col items-center pt-8 pb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Heave Games API Admin Panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={login.isPending}>
              {login.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8 pt-0">
          <p className="text-sm text-muted-foreground">
            Secured by Heave Games Engine
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
