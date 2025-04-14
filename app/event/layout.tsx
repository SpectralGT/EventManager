import AttendeeHeader from "@/components/AttendeeHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AttendeeHeader></AttendeeHeader>
      {children}
    </>
  );
}
