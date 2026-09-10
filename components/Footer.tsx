export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto p-4 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Ticko - Proyecto Escolar ESCOM. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}