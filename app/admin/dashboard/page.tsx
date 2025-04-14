"use client";

import AdminApp from "@/components/adminDashboard/AdminApp";

const Home = () => {
  if (typeof window !== "undefined") {
    return <AdminApp />;
  }
};

export default Home;
