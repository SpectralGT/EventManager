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
  BooleanField,
  BooleanInput,
} from "react-admin";

// const jsonFormat = (value: any) => JSON.stringify(value, null, 2);
// const jsonParse = (value: string) => {
//   try {
//     return JSON.parse(value);
//   } catch (e) {
//     return [];
//   }
// };

export const GuestList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />

      <ReferenceField source="eventId" reference="event" label="Event">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="attendeeId" reference="attendee" label="Author">
        <TextField source="username" />
      </ReferenceField>

      <TextField source="guestName" />
      <BooleanField source="isGuestFamily" />
      <NumberField source="guestAdultCount" />
      <NumberField source="guestChildCount" />

      <ArrayField source="guestItems">
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

export const GuestEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="eventId" reference="event" label="Event">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="attendeeId" reference="attendee" label="Attendee">
        <SelectInput optionText="username" />
      </ReferenceInput>

      <TextInput source="guestName" />
      <BooleanInput source="isGuestFamily" />
      <NumberInput source="guestAdultCount" />
      <NumberInput source="guestChildCount" />

      <ArrayInput source="guestItems">
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

export const GuestCreate = () => (
  <Create>
    <SimpleForm>
      {/* <TextInput source="items" label="Items (JSON)" multiline parse={jsonParse} format={jsonFormat} /> */}

      <ReferenceInput source="eventId" reference="event" label="Event">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="attendeeId" reference="attendee" label="Attendee">
        <SelectInput optionText="username" />
      </ReferenceInput>

      <TextInput source="guestName" />
      <BooleanInput source="isGuestFamily" />
      <NumberInput source="guestAdultCount" />
      <NumberInput source="guestChildCount" />

      <ArrayInput source="guestItems">
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
