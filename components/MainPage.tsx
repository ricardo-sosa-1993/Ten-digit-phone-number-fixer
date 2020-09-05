import React, { useEffect, useState } from "react";
import { PermissionsAndroid } from "react-native";
import Contacts from "react-native-contacts";
import ContactList from "./ContactList";
import { View, Dimensions } from "react-native";
import { Text, Button } from "native-base";

interface Contact extends Contacts.Contact {
  key: string;
  selected: boolean;
}

export default function MainPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "Contactos",
        message: "Necesitamos ver tus contactos",
        buttonPositive: "Acepta :)",
      }
    );

    Contacts.getAll((err, contacts) => {
      if (err === "denied") {
        // error
      } else {
        const newContacts = contacts
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
              ...newContact,
              key: newContact.recordID,
              selected: false,
            };
          });

        setContacts(newContacts);
      }
    });
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
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: "Contactos",
        message: "Necesitamos editar tus contactos",
        buttonPositive: "Acepta :)",
      }
    );
    setLoading(true);
    const selectedContacts = contacts.filter((contact) => contact.selected);

    for (let i = 0; i < selectedContacts.length; i++) {
      const newNumbers = selectedContacts[i].phoneNumbers.map(
        (phoneNumber) => ({
          ...phoneNumber,
          number:
            phoneNumber.number &&
            phoneNumber.number.replace(/-| /g, "").substr(-10),
        })
      );

      const newContact = {
        ...selectedContacts[i],
        phoneNumbers: newNumbers
      };

      console.log('goin to update ', newContact);

      Contacts.deleteContact(selectedContacts[i], (err) => {
        if (err) {
          throw err;
        }
        // contact deleted
      })

      Contacts.addContact(newContact, (err) => {
        if (err) throw err;
        // save successful
      })
    }
    fetchContacts();
    setLoading(false);
  };

  if (loading) {
    <Text>Cargando...</Text>;
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
