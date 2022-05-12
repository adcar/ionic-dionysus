import React, { useState, useEffect, useRef } from "react";
import useAsyncEffect from "use-async-effect";
import trakt from "../util/api/trakt";
import tmdb from "../util/api/tmdb";
import Card from "../components/Card";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";

interface IProps {
  initialTerm: string;
  type: "show" | "movie";
  history: any;
}

export default function SearchResults({ initialTerm, type, history }: IProps) {
  const [shows, setShows]: any[] = useState([]);
  const searchRef = useRef(null);
  const [term, setTerm]: [string | undefined, any] = useState(initialTerm);

  function onChange(val: string) {
    if (val !== "") {
      setTerm(val);
    } else {
      setTerm(undefined);
    }
  }

  useEffect(() => {
    // Set the term since react likes to keep the previous val for the useState hook
    setTerm(initialTerm);
  }, [initialTerm]);

  useAsyncEffect(async () => {
    if (term === "") {
      return;
    }
    const showInfos = await trakt.search.text({
      type,
      query: term,
    });

    let showPromises = showInfos.map((ep: any) => {
      if (ep.show.ids.tmdb === null) {
        return null;
      }

      return tmdb(`/tv/${ep.show.ids.tmdb}`);
    });

    showPromises = showPromises.filter(
      (showPromise: Promise<any> | null) => showPromise !== null
    );

    const showElements: any[] = [];
    const width = 342;

    await Promise.all(showPromises).then((shows: any[]) => {
      shows.forEach((show) => {
        const foundShow = showInfos.find(
          (ep: any) => ep.show.ids.tmdb === show.id
        );

        if (foundShow !== undefined) {
          showElements.push(
            <Card
              key={foundShow.show.ids.trakt}
              traktId={foundShow.show.ids.trakt}
              bgUrl={
                show.backdrop_path !== null
                  ? `https://image.tmdb.org/t/p/w${width}${show.backdrop_path}`
                  : null
              }
              name={show.name}
              seasons={show.number_of_seasons}
              year={
                show.first_air_date !== null
                  ? parseInt(show.first_air_date.slice(0, 4))
                  : null
              }
            />
          );
        }
      });
    });

    setShows(showElements);
  }, [term]);

  if (searchRef !== null && searchRef.current !== null) {
    (searchRef.current as any).setFocus();
  }
  return (
    <IonPage>
      <IonContent>
        <IonButton
          style={{ marginRight: 20 }}
          fill="clear"
          color="dark"
          size="large"
          href={`/shows`}
        >
          <IonIcon icon={chevronBack} />
        </IonButton>
        <IonSearchbar
          ref={searchRef}
          placeholder="Search for TV Shows"
          onIonChange={(e: any) => onChange(e.detail.value)}
          onIonClear={() => {
            history.push("/shows");
          }}
        />

        {term !== undefined ? (
          <>
            <h1
              style={{
                paddingLeft: 20,
              }}
            >
              {type === "show" ? "Shows" : "Movies"} matching "{term}"
            </h1>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat( auto-fit, minmax(350px, 1fr) )",
                gridGap: 10,
                gridAutoRows: "minmax(100px, auto)",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              {shows}
            </div>
          </>
        ) : (
          <h1
            style={{
              paddingLeft: 20,
            }}
          >
            Start searching for {type === "show" ? "shows" : "movies"}
          </h1>
        )}
      </IonContent>
    </IonPage>
  );
}
