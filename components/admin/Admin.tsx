import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';

export const AdminList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AdminEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="password" />
    </SimpleForm>
  </Edit>
);

export const AdminCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="password" />
    </SimpleForm>
  </Create>
);
