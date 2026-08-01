"use client";
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  LifeBuoy,
  Lock,
  Coffee,
  UserCog,
  ChefHat,
  ConciergeBell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { icon: UserCog, label: "Admin", access: "Full access · billing & staff" },
  { icon: ChefHat, label: "Chef", access: "Kitchen queue · prep & ready" },
  { icon: ConciergeBell, label: "Waiter", access: "Tables · serve & cancel" },
];

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/40 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/login" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Secret Cafe
          </span>
        </Link>
        <Badge
          variant="outline"
          className="gap-1.5 border-border bg-card/70 backdrop-blur"
        >
          <Lock className="h-3.5 w-3.5" />
          Restricted area
        </Badge>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-6">
        <div className="flex w-full flex-col items-center text-center">
          <div className="relative mb-8">
            <span className="absolute inset-0 animate-ping rounded-3xl bg-destructive/10" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10 text-destructive">
              <ShieldAlert className="h-10 w-10" />
            </span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Error 401
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Access denied
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Your current role doesn't have permission to open this part of
            Secret Cafe. If you think this is a mistake, ask an administrator to
            update your access.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 bg-card"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-14 max-w-3xl" />

        <section className="w-full">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            What each role can access
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => (
              <Card
                key={role.label}
                className="border-border/70 bg-card/80 shadow-soft backdrop-blur transition-transform hover:-translate-y-1"
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <role.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {role.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {role.access}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-10 w-full max-w-3xl border-primary/20 bg-primary/5 shadow-soft">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <LifeBuoy className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                Need access to this page?
              </p>
              <p className="text-sm text-muted-foreground">
                Reach out to your cafe manager or the Secret Cafe admin team to
                have your role upgraded.
              </p>
            </div>
            <Button variant="secondary" className="shrink-0">
              Contact admin
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};