import "./globals.css";

export const metadata = {
  title: "M-Steakhouse Frankfurt",
  description:
    "M-Steakhouse in Frankfurt am Main mit aktuellen Inhalten auf Deutsch, Speisekarte, Galerie, Kontakt und Reservierung.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/eye-catching-pro" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://stksteakhouse.com/wp-content/themes/stk-steakhouse-2024/assets/dist/css/style.css?ver=1776156306"
        />
      </head>
      <body className="wp-singular locations-template-default single single-locations postid-754 wp-theme-stk-steakhouse-2024">
        {children}
      </body>
    </html>
  );
}
