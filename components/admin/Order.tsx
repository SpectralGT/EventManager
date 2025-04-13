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
} from "react-admin";

// const jsonFormat = (value: any) => JSON.stringify(value, null, 2);
// const jsonParse = (value: string) => {
//   try {
//     return JSON.parse(value);
//   } catch (e) {
//     return [];
//   }
// };

export const OrderList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />

      <ReferenceField source="eventId" reference="event" label="Event">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="attendeeId" reference="attendee" label="Author">
        <TextField source="username" />
      </ReferenceField>

      <ArrayField source="items">
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
    </SimpleForm>
  </Create>
);
