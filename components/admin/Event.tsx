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
          <TextInput source="name" helperText={false} />
          <NumberInput source="price" helperText={false} />
          <NumberInput source="quantity" helperText={false} />
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
      <DateInput source="startDate" />
      <DateInput source="endDate" />
      <ArrayInput source="tickets">
        <SimpleFormIterator inline>
          <TextInput source="name" helperText={false} />
          <NumberInput source="price" helperText={false} />
          <NumberInput source="quantity" helperText={false} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
