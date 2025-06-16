import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, useUnique, PasswordInput } from "react-admin";

export const OperatorList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="email"/>
      <EditButton />
    </Datagrid>
  </List>
);

export const OperatorEdit = () => {
  const unique = useUnique();

  return (
    <Edit>
      <SimpleForm>
        <TextInput source="username" validate={unique()} />
        <TextInput source="email" type="email" />
        <PasswordInput source="password" />
      </SimpleForm>
    </Edit>
  );
};

export const OperatorCreate = () => {
  const unique = useUnique();

  return (
    <Create>
      <SimpleForm>
        <TextInput source="username" validate={unique()} />
        <TextInput source="email" type="email" />
        <PasswordInput source="password" />
      </SimpleForm>
    </Create>
  );
};
