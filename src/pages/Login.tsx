import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import trakt from "../util/api/trakt";

export default function Login() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    (async () => {
      setUrl(trakt.get_url());
    })();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80%",
            padding: 20,
          }}
        >
          <div>
            <h1>Login to Trakt.tv</h1>
            <p>
              Dionysus requires a Trakt.tv account for keeping track of your
              watch history
            </p>
            <IonButton
              disabled={!url}
              onClick={() => {
                window.location.href = url;
              }}
            >
              Sign up
            </IonButton>
            <IonButton
              fill="clear"
              disabled={!url}
              onClick={() => {
                window.location.href = url;
              }}
            >
              Login
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
