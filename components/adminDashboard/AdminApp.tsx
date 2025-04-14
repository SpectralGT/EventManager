// in src/components/AdminApp.tsx
"use client"; // remove this line if you choose Pages Router
// pages/admin.tsx
import { dataProvider } from "ra-data-simple-prisma";
import { Admin, Resource } from 'react-admin';
import { AttendeeList, AttendeeEdit, AttendeeCreate } from './components/Attendee';
import { EventList, EventEdit, EventCreate } from './components/Event';
import { OrderList, OrderEdit, OrderCreate } from './components/Order';
import { AdminList, AdminEdit, AdminCreate } from './components/Admin';
import { OperatorList, OperatorEdit, OperatorCreate } from './components/Operator';
import LogoutButton from "@/components/LogoutButton";


export default function AdminPanel() {
  return (
    <Admin dataProvider={dataProvider("/api/admin")}>
      <LogoutButton></LogoutButton>
      <Resource name="attendee" list={AttendeeList} edit={AttendeeEdit} create={AttendeeCreate} />
      <Resource name="event" list={EventList} edit={EventEdit} create={EventCreate} />
      <Resource name="order" list={OrderList} edit={OrderEdit} create={OrderCreate} />
      <Resource name="admin" list={AdminList} edit={AdminEdit} create={AdminCreate} />
      <Resource name="operator" list={OperatorList} edit={OperatorEdit} create={OperatorCreate} />
    </Admin>
  );
}
