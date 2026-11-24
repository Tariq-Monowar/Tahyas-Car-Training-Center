// Applies the saved (or system) theme before first paint so there's no flash.
const themeScript = `(function(){try{var t=localStorage.getItem("tahyas-admin-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* viewport-fit=cover + safe-area padding in CSS → edge-to-edge in the installed app */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121821" />
        {/* Own manifest → "Install app" from /admin creates a separate admin app that opens /admin */}
        <link rel="manifest" href="/admin/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="Tahyas Admin" />
        <meta name="application-name" content="Tahyas Admin" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin | তাহয়াস</title>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Noto Sans Bengali', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
