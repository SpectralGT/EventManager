import OperatorHeader from "@/components/OperatorHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <OperatorHeader></OperatorHeader>
      {children}
    </>
  );
}
