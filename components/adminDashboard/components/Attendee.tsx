import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  Create,
  ChipField,
  ReferenceManyField,
  PasswordInput,
  useUnique,
  NumberInput
} from "react-admin";

export const AttendeeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextInput source="email" type="email" />
      <TextField source="username" />
      <BooleanField source="isFamily" />
      <TextField source="balance" />
      <TextField source="debt" />
      <ReferenceManyField label="Orders" reference="order" target="attendeeId">
        <Datagrid rowClick="edit">
          <ChipField source="id" />
        </Datagrid>
      </ReferenceManyField>
      <EditButton />
    </Datagrid>
  </List>
);

export const AttendeeEdit = () => {
  const unique = useUnique();

  return(
  <Edit>
    <SimpleForm>
      <TextInput source="username" validate={unique()}  />
      <TextInput source="email" type="email" />
      <PasswordInput source="password" />
      <BooleanInput source="isFamily" />
      <NumberInput source="balance" defaultValue={1000}/>
      <NumberInput source="debt" defaultValue={-1000}/>
    </SimpleForm>
  </Edit>)
};

export const AttendeeCreate = () => {
  const unique = useUnique();
return(
  <Create>
    <SimpleForm>
      <TextInput source="username" validate={unique()}/>
      <TextInput source="email" type="email" />
      <PasswordInput source="password" />
      <BooleanInput source="isFamily" />
      <NumberInput source="balance" defaultValue={1000}/>
      <NumberInput source="debt" defaultValue={-1000}/>
    </SimpleForm>
  </Create>)
};
