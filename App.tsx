import React, { useEffect, useState } from "react";
import { AppLoading } from "expo";
import { Container, Content, Header } from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import MainPage from "./components/MainPage";

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initFonts();
  }, []);

  const initFonts = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    setReady(true);
  };

  if (!ready) {
    return <AppLoading />;
  }

  return (
    <Container>
      <Header />
      <Content>
        <MainPage />
      </Content>
    </Container>
  );
}
