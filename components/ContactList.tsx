import React from "react";
import { TouchableOpacity, View, ScrollView } from "react-native";
import { Text, CheckBox } from "native-base";

interface Props {
  contacts: any[];
  onSelect(key: string): any;
}

export default function ContactList({ contacts, onSelect }: Props) {
  const renderFunction = (contact: any) => {
    return (
      <TouchableOpacity key={contact.key} onPress={() => onSelect(contact.key)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderBottomColor: "#a1a2a7",
            borderBottomWidth: 1,
          }}
        >
          <Text>{contact.name}</Text>
          <CheckBox
            onPress={() => onSelect(contact.key)}
            checked={contact.selected}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return <ScrollView>{contacts.map(renderFunction)}</ScrollView>;
}
