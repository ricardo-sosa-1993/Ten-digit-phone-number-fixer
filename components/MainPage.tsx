import React, { useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import ContactList from "./ContactList";
import { View, Dimensions } from "react-native";
import { Text, Button } from "native-base";

interface Contact {
  key: string;
  id: string;
  name: string;
  phoneNumbers: Contacts.PhoneNumber[];
  selected: boolean;
}

export default function MainPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initContacts();
  }, []);

  const initContacts = async () => {
    const newContacts = await fetchContacts();
    setContacts(newContacts);
  };

  const fetchContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const newContacts = data
        .filter((newContact) => {
          const hasInvalidPhoneNumber =
            newContact.phoneNumbers &&
            newContact.phoneNumbers.find(
              (phoneNumber) =>
                phoneNumber.number &&
                phoneNumber.number.replace(/-| /g, "").length > 10
            );
          return !!hasInvalidPhoneNumber;
        })
        .map((newContact) => {
          return {
            key: newContact.id,
            id: newContact.id,
            name: newContact.name,
            phoneNumbers: newContact.phoneNumbers || [],
            selected: false,
          };
        });

      return newContacts;
    }
    return [];
  };

  const onContactSelect = (key: string) => {
    const newContacts = contacts.map((newContact) => {
      if (newContact.key === key) {
        return {
          ...newContact,
          selected: !newContact.selected,
        };
      }

      return newContact;
    });

    setContacts(newContacts);
  };

  const onUpdateContacts = async () => {
    setLoading(true);
    const selectedContacts = contacts.filter((contact) => contact.selected);

    for (let i = 0; i < selectedContacts.length; i++) {
      const newNumbers = selectedContacts[i].phoneNumbers.map(
        (phoneNumber) => ({
          // ...phoneNumber,
          number:
            phoneNumber.number &&
            phoneNumber.number.replace(/-| /g, "").substr(-10),
        })
      );
      // @ts-ignore
      // const contact: Contacts.Contact = {
      //   id: selectedContacts[i].id,
      //   phoneNumbers: newNumbers,
      // };
      // @ts-ignore
      await Contacts.presentFormAsync(selectedContacts[i].id, {
        [Contacts.Fields.PhoneNumbers]: newNumbers,
      });
    }
    const newContacts = await fetchContacts();
    setContacts(newContacts);
    setLoading(false);
  };

  if (loading) {
    <Text>Loading</Text>;
  }

  if (contacts.length === 0) {
    return <Text>No se encontraron contactos</Text>;
  }

  return (
    <View
      style={{
        flexDirection: "column",
        height: Dimensions.get("window").height - 60,
      }}
    >
      <Text style={{ fontWeight: "bold", paddingTop: 20, padding: 10 }}>
        Seleccionar contactos a corregir
      </Text>
      <ContactList contacts={contacts} onSelect={onContactSelect} />
      <Button block onPress={onUpdateContacts}>
        <Text>Corregir contactos</Text>
      </Button>
    </View>
  );
}
