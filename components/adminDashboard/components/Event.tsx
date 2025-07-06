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
  NumberField,
  DateField,
  DateTimeInput,
  TimeInput,
  required,
} from "react-admin";

import { RichTextInput } from "ra-input-rich-text";

// const jsonFo4rmat = (value: any) => JSON.stringify(value, null, 2);
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
      <ArrayField source="items">
        <Datagrid bulkActionButtons={false}>
          <ArrayField source="days">
              <TextField source="description" />
            <Datagrid bulkActionButtons={false}>
              <TextField source="name" />
              <NumberField source="singleMemberPrice" />
              <NumberField source="familyMemberPrice" />
              <NumberField source="kidsMemberPrice" />
              <NumberField source="singleGuestPrice" />
              <NumberField source="familyGuestPrice" />
              <NumberField source="kidsGuestPrice" />
            </Datagrid>
          </ArrayField>
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
      <TextInput source="imgURL" validate={required()} />
      <TextInput source="title" validate={required()} />
      <RichTextInput source="description" validate={required()} />
      <DateInput source="startDate" validate={required()} />
      <DateInput source="endDate" validate={required()} />
      <ArrayInput source="items" validate={required()}>
        <SimpleFormIterator inline>
          <ArrayInput source="days" validate={required()}>
            <SimpleFormIterator inline>
              <TextInput source="name" validate={required()} />
              <NumberInput source="price" validate={required()} />
              <NumberInput source="priceGuestSingle" validate={required()} />
              <NumberInput source="priceGuestFamily" validate={required()} />
              <TimeInput source="serveStartTime" validate={required()} />
              <TimeInput source="serveEndTime" validate={required()} />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="imgURL" validate={required()} />
      <TextInput source="title" validate={required()} />
      <RichTextInput source="description" validate={required()} />
      <DateTimeInput source="startDate" validate={required()} />
      <DateTimeInput source="endDate" validate={required()} />
      <ArrayInput source="items" validate={required()}>
        <SimpleFormIterator inline>
          <ArrayInput source="days" validate={required()}>
            <SimpleFormIterator inline>
              <TextInput source="name" validate={required()} />
              <NumberInput source="price" validate={required()} />
              <NumberInput source="priceGuestSingle" validate={required()} />
              <NumberInput source="priceGuestFamily" validate={required()} />
              <TimeInput source="serveStartTime" validate={required()} />
              <TimeInput source="serveEndTime" validate={required()} />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
