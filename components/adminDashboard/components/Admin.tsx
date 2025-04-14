import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, PasswordInput, useUnique } from "react-admin";

export const AdminList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AdminEdit = () => {
  const unique = useUnique();

  return (
    <Edit>
      <SimpleForm>
        <TextInput source="username" validate={unique()} />
        <PasswordInput source="password" />
      </SimpleForm>
    </Edit>
  );
};

export const AdminCreate = () => {
  const unique = useUnique();
  return (
    <Create>
      <SimpleForm>
        <TextInput source="username" validate={unique()} />
        <PasswordInput source="password" />
      </SimpleForm>
    </Create>
  );
};
