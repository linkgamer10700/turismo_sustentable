import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rutas que requieren autenticación estricta
  const isProtectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/negocio") ||
    pathname.startsWith("/dashboard");

  if (isProtectedPath && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return Response.redirect(
      new URL(`/login/loginUser?callbackUrl=${callbackUrl}`, req.nextUrl)
    );
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
