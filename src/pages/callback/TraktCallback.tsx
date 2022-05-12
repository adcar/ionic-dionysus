import React, { useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import qs from "qs";
import { Plugins } from "@capacitor/core";
import trakt from "../../util/api/trakt";

const { Storage } = Plugins;

interface IProps {
  history: any;
  setAuthed: any;
}

function TraktCallback({ history, setAuthed }: IProps) {
  useEffect(() => {
    (async () => {
      //const r = await startTorrent("South Park", 13, 12);

      const { code } = qs.parse(window.location.search.replace("?", ""));

      trakt.exchange_code(code).then(async (result: any) => {
        const token = trakt.export_token();
        await Storage.set({
          key: "token",
          value: JSON.stringify(token),
        });
        setAuthed(true);
        history.push("/");
        // contains tokens & session information
        // API can now be used with authorized requests
      });
    })();
  }, [history, setAuthed]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trakt auth</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
}

export default TraktCallback;
