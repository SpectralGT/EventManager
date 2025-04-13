"use client";

import { NextPage } from "next";
// import dynamic from "next/dynamic";
// const AdminApp = dynamic(() => import("@/components/AdminApp"), { ssr: false });

import AdminApp from "@/components/AdminApp";

const Home = () => {
  if (typeof window !== "undefined") {
    return <AdminApp />;
  }
};

export default Home;
