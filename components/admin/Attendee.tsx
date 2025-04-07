import { List, Datagrid, TextField, BooleanField, EditButton, Edit, SimpleForm, TextInput, BooleanInput, Create } from 'react-admin';

export const AttendeeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="name" />
      <BooleanField source="isFamily" />
      <TextField source="balance" />
      <TextField source="debt" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AttendeeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="name" />
      <TextInput source="password" />
      <BooleanInput source="isFamily" />
      <TextInput source="balance" />
      <TextInput source="debt" />
    </SimpleForm>
  </Edit>
);

export const AttendeeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="name" />
      <TextInput source="password" />
      <BooleanInput source="isFamily" />
      <TextInput source="balance" />
      <TextInput source="debt" />
    </SimpleForm>
  </Create>
);
