import AttendeeHeader from "@/components/headers/AttendeeHeader";

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
