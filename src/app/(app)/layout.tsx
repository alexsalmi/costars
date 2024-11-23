import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header showLogo />
      <main>
        {children}
      </main>
      <Footer/>
    </>
  );
}