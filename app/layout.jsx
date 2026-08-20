export const metadata = {
  title: "Calgary Barbell — 16-Week Program",
  description: "16-week powerlifting program tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#141311" }}>{children}</body>
    </html>
  );
}
