// components/admin/Event.tsx
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  Create,
  EditButton,
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
  ArrayField,
  ReferenceArrayField,
  NumberField,
  DateField,
  DateTimeInput,
  TimeInput,
} from "react-admin";

// const jsonFormat = (value: any) => JSON.stringify(value, null, 2);
// const jsonParse = (value: string) => {
//   try {
//     return JSON.parse(value);
//   } catch (e) {
//     return [];
//   }
// };

export const EventList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <DateField source="startDate" />
      <DateField source="endDate" />
      <ArrayField source="tickets">
        <Datagrid bulkActionButtons={false}>
          <TextField source="name" />
          <NumberField source="price" />
          <NumberField source="quantity" />
          <DateField source="serveStartTime" />
          <DateField source="serveEndTime" />
        </Datagrid>
      </ArrayField>

      {/* <ReferenceArrayField reference="Order" source="orders" label="Orders" /> */}

      <EditButton />
    </Datagrid>
  </List>
);

export const EventEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="imgURL" />
      <TextInput source="title" />
      <TextInput source="description" />
      <DateInput source="startDate" />
      <DateInput source="endDate" />

      <ArrayInput source="tickets">
        <SimpleFormIterator inline>
          <TextInput source="name" />
          <NumberInput source="price" />
          <NumberInput source="quantity" />
          <TimeInput source="serveStartTime" parse={(date: Date) => (date ? new Date(date).toISOString() : null)}/>
          <TimeInput source="serveEndTime" parse={(date: Date) => (date ? new Date(date).toISOString() : null)}/>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="imgURL" />
      <TextInput source="title" />
      <TextInput source="description" />
      <DateTimeInput source="startDate"  parse={(date: Date) => (date ? new Date(date).toISOString() : null)}/>
      <DateTimeInput source="endDate"  parse={(date: Date) => (date ? new Date(date).toISOString() : null)}/>
      <ArrayInput source="tickets">
        <SimpleFormIterator inline>
          <TextInput source="name" />
          <NumberInput source="price" />
          <NumberInput source="quantity" />
          <TimeInput source="serveStartTime"/>
          <TimeInput source="serveEndTime"/>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
