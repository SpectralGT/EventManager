import AdminHeader from "@/components/headers/AdminHeader";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AdminHeader></AdminHeader>
      {children}
    </>
  );
}
