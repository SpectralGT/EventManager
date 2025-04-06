// in src/components/AdminApp.tsx
"use client"; // remove this line if you choose Pages Router
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import { dataProvider } from "ra-data-simple-prisma";

export default function AdminApp() {
  return (
    <Admin dataProvider={dataProvider("/api/admin")}>
      {/* <Resource name="admins" list={ListGuesser} edit={EditGuesser} recordRepresentation="admins" /> */}
      <Resource name="admins" recordRepresentation="admins" />
      {/* <Resource name="posts" list={ListGuesser} edit={EditGuesser} recordRepresentation="title" /> */}
      {/* <Resource name="comments" list={ListGuesser} edit={EditGuesser} /> */}
    </Admin>
  );
}
