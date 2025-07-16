// app/page.tsx
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Mail, Github, Linkedin } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gradient-to-br from-background to-muted text-foreground">
      <div className="text-center max-w-3xl space-y-6 flex-1 flex flex-col justify-center">
        <Wrench className="h-24 w-24 mx-auto text-primary mb-4" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-primary">
          MiniApp de Solicitudes
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Simplifica la gestión de herramientas en tu organización. Solicita lo
          que necesitas, administra el inventario y haz un seguimiento de cada
          préstamo.
        </p>
        <div className="mt-8 space-y-4">
          <SignedOut>
            <p className="text-md md:text-lg text-foreground/80">
              Inicia sesión para acceder a la plataforma.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <SignInButton mode="modal">
                <Button size="lg" className="px-8 py-3">
                  Iniciar Sesión
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <p className="text-md md:text-lg text-foreground/80">
              ¡Bienvenido de nuevo!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-3">
                  Ir al Dashboard
                </Button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </div>
      {/* FOOTER PERSONALIZADO */}
      <footer className="mt-auto pt-12 text-center text-muted-foreground/80">
        <p className="text-sm">Desarrollado con ❤️ por Diego Bonilla</p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="mailto:drbv27@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Enviar un correo a Diego Bonilla"
          >
            <Mail className="h-6 w-6 hover:text-primary transition-colors" />
            <span className="sr-only">Email</span>
          </a>
          <a
            href="https://github.com/drbv27"
            target="_blank"
            rel="noopener noreferrer"
            title="Perfil de GitHub de Diego Bonilla"
          >
            <Github className="h-6 w-6 hover:text-primary transition-colors" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/diego-ricardo-bonilla-villa-7179254a/"
            target="_blank"
            rel="noopener noreferrer"
            title="Perfil de LinkedIn de Diego Bonilla"
          >
            <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-4">
          Construido con Next.js, Clerk, MongoDB, y Tailwind CSS.
        </p>
      </footer>
    </main>
  );
}
