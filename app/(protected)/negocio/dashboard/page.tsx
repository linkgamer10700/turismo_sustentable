import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, CheckCircle2 } from "lucide-react";

export default async function NegocioPage() {
    const session = await auth();

    if (!session) {
        redirect("/login/loginNegocio");
    }

    const userName = session.user?.name || "Negocio";
    const userEmail = session.user?.email || "negocio@test.com";

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                        Ticko
                    </Link>

                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/login/loginNegocio" });
                            }}
                        >
                            <Button variant="outline" size="sm" type="submit" className="gap-2">
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto flex-1 p-6 md:p-10 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Panel de Negocio
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Bienvenido, <span className="font-semibold text-foreground">{userName}</span>.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Negocio</span>
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="mt-4">
                            <p className="text-lg font-bold text-card-foreground">{userName}</p>
                            <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Estado de Cuenta</span>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="mt-4">
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Activa</p>
                            <p className="text-sm text-muted-foreground">Sesión autenticada</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="border-b bg-muted/40 px-6 py-4">
                        <h2 className="text-base font-semibold text-card-foreground">
                            Datos de tu Sesión
                        </h2>
                    </div>
                    <div className="p-6">
                        <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto text-foreground">
                            {JSON.stringify(session, null, 2)}
                        </pre>
                    </div>
                </div>
            </main>
        </div>
    );
}