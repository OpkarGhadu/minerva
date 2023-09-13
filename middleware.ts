/*  Middleware protects our entire application. If you try to access
    it, the middleware will redirect you to your sign up page
    By default, all routes are treated as prvate if the middleware
        runs, therefore we specify public routes
*/

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // An array of public routes that don't require authentication.
  publicRoutes: ['/', "/api/webhook/clerk"],

  // An array of routes to be ignored by the authentication middleware.
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};