import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, ReferenceInput, SelectInput } from 'react-admin';

const jsonFormat = (value: any) => JSON.stringify(value, null, 2);
const jsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return [];
  }
};

export const OrderList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="attendeeId" />
      <TextField source="eventId" />
      <TextField source="items" />
      <EditButton />
    </Datagrid>
  </List>
);

export const OrderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="attendeeId" />
      <TextInput source="eventId" />
      <TextInput
        source="items"
        label="Items (JSON)"
        multiline
        parse={jsonParse}
        format={jsonFormat}
      />
    </SimpleForm>
  </Edit>
);

export const OrderCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="attendeeId" />
      <TextInput source="eventId" />
      <TextInput
        source="items"
        label="Items (JSON)"
        multiline
        parse={jsonParse}
        format={jsonFormat}
      />
    </SimpleForm>
  </Create>
);
