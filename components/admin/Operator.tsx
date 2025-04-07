import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';

export const OperatorList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="name" />
      <EditButton />
    </Datagrid>
  </List>
);

export const OperatorEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="name" />
      <TextInput source="password" />
    </SimpleForm>
  </Edit>
);

export const OperatorCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="name" />
      <TextInput source="password" />
    </SimpleForm>
  </Create>
);
