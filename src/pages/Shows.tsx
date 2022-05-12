import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";

import ContinueWatching from "../components/scrolls/ContinueWatching";
import Trending from "../components/scrolls/Trending";
import Watchlist from "../components/scrolls/Watchlist";

interface IProps {
  history: any;
}

function Shows({ history }: IProps) {
  function onChange(val: string) {
    if (val !== "") {
      history.push(`/search/shows/${val}`);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TV Shows</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dionysus tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          onFocus={() => {
            history.push("/search/shows/");
          }}
          placeholder="Search for TV Shows"
          value=""
          onIonChange={(e: any) => onChange(e.detail.value)}
        />

        <ContinueWatching />
        <Watchlist />
        <Trending />
      </IonContent>
    </IonPage>
  );
}

export default Shows;
