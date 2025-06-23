import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  NumberInput,
  ArrayInput,
  TimeInput,
  ArrayField,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
  BooleanInput,
} from "react-admin";

import { Button, ExportButton, TopToolbar } from "react-admin";
import { downloadCSV } from "react-admin";
import jsonExport from "jsonexport";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exportGuest = (orders: any) => {
  // @ts-expect-error : order can be anything
  const orderForExport = orders.map((order) => {
    const { memberItems, isGuestOrder, ...orderForExport } = order; // omit memberItems and isGuestOrder
    return orderForExport;
  });
  jsonExport(
    orderForExport,
    {
      headers: [
        "id",
        "attendeeId",
        "eventId",
        "guestName",
        "guestIsFamily",
        "guestAdultCount",
        "guestChildCount",
        "guestItems",
      ], // order fields in the export
    },
    (err, csv) => {
      downloadCSV(csv, "guestOrders"); // download as 'posts.csv` file
    }
  );
};

const OrderListActions = () => (
  <TopToolbar>
    <ExportButton exporter={exportGuest}></ExportButton>
    <ExportButton />
  </TopToolbar>
);

export const OrderList = () => (
  <List actions={<OrderListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />

      <ReferenceField source="eventId" reference="event" label="Event">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="attendeeId" reference="attendee" label="Author">
        <TextField source="username" />
      </ReferenceField>

      <ArrayField source="memberItems">
        <Datagrid bulkActionButtons={false}>
          <TextField source="name" />
          <NumberField source="price" />
          <NumberField source="quantity" />
          <NumberField source="served" />
          <DateField source="serveStartTime" />
          <DateField source="serveEndTime" />
        </Datagrid>
      </ArrayField>

      <BooleanField source="isGuestOrder" />
      <TextField source="guestName" />
      <BooleanField source="isGuestFamily" />
      <NumberField source="guestAdultCount" />
      <NumberField source="guestChildCount" />

      <ArrayField source="guestItems">
        <Datagrid bulkActionButtons={false}>
          <TextField source="name" />
          <NumberField source="price" />
          <NumberField source="quantity" />
          <NumberField source="served" />
          <DateField source="serveStartTime" />
          <DateField source="serveEndTime" />
        </Datagrid>
      </ArrayField>

      <EditButton />
    </Datagrid>
  </List>
);

export const OrderEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="eventId" reference="event" label="Event">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="attendeeId" reference="attendee" label="Attendee">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <ArrayInput source="items">
        <SimpleFormIterator inline>
          <TextInput source="name" />
          <NumberInput source="price" />
          <NumberInput source="quantity" />
          <NumberInput source="served" />
          <TimeInput source="serveStartTime" />
          <TimeInput source="serveEndTime" />
        </SimpleFormIterator>
      </ArrayInput>
      <BooleanInput source="isGuestOrder" />
      <TextInput source="guestName" />
      <BooleanInput source="isGuestFamily" />
      <NumberInput source="guestAdultCount" />
      <NumberInput source="guestChildCount" />
      <ArrayInput source="guestItems">
        <SimpleFormIterator inline>
          <TextInput source="name" />
          <NumberInput source="price" />
          <NumberInput source="quantity" />
          <NumberInput source="served" />
          <TimeInput source="serveStartTime" />
          <TimeInput source="serveEndTime" />
        </SimpleFormIterator>
      </ArrayInput>
      c
    </SimpleForm>
  </Edit>
);

export const OrderCreate = () => (
  <Create>
    <SimpleForm>
      {/* <TextInput source="items" label="Items (JSON)" multiline parse={jsonParse} format={jsonFormat} /> */}

      <ReferenceInput source="eventId" reference="event" label="Event">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="attendeeId" reference="attendee" label="Attendee">
        <SelectInput optionText="username" />
      </ReferenceInput>

      <ArrayInput source="memberItems">
        <SimpleFormIterator inline>
          <TextInput source="name" />
          <NumberInput source="price" />
          <NumberInput source="quantity" />
          <NumberInput source="served" />
          <TimeInput source="serveStartTime" />
          <TimeInput source="serveEndTime" />
        </SimpleFormIterator>
      </ArrayInput>

      <BooleanInput source="isGuestOrder" />
      <TextInput source="guestName" />
      <BooleanInput source="isGuestFamily" />
      <NumberInput source="guestAdultCount" />
      <NumberInput source="guestChildCount" />

      <ArrayInput source="guestItems">
        <SimpleFormIterator inline>
          <TextInput source="name" />
          <NumberInput source="price" />
          <NumberInput source="quantity" />
          <NumberInput source="served" />
          <TimeInput source="serveStartTime" />
          <TimeInput source="serveEndTime" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
