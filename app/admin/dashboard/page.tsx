import { NextPage } from "next";
// import dynamic from "next/dynamic";
// const AdminApp = dynamic(() => import("@/components/AdminApp"), { ssr: false });

import AdminApp from "@/components/AdminApp";

const Home: NextPage = () => <AdminApp />;

export default Home;
