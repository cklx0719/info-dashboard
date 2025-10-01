import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";
import { initBrowserCompatibility } from "./utils/browser-compatibility";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="edge-compatibility" content="IE=edge" />
        <meta name="renderer" content="webkit" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
          visibleToasts={3}
        />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Edge浏览器兼容性预处理
              if (navigator.userAgent.includes('Edg/')) {
                console.log('Edge浏览器检测，启用兼容性模式');
                window.__EDGE_COMPAT__ = true;
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    // 初始化浏览器兼容性处理
    initBrowserCompatibility();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export function RouteErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// 导出为ErrorBoundary以保持React Router的约定
export { RouteErrorBoundary as ErrorBoundary };
