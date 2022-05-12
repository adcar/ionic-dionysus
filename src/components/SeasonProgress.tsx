import React, { useState } from "react";
import { IonButton, IonProgressBar, IonIcon } from "@ionic/react";
import trakt from "../util/api/trakt";
import { chevronForward } from "ionicons/icons";

interface IProps {
  season: any;
  traktInfo: any;
}

export default function SeasonProgress({ season, traktInfo }: IProps) {
  const [progress, setProgress] = useState(season.completed / season.aired);
  return (
    <div
      style={{
        height: 100,
        backgroundColor: "var(--ion-color-light)",
        width: "120vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        marginTop: 20,
        paddingTop: 20,
        marginBottom: 20,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          marginLeft: 20,
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        Season {season.number}
        {progress === 1 ? (
          <IonButton
            onClick={() => {
              (async () => {
                setProgress(0);
                await trakt.sync.history.remove({
                  shows: [
                    {
                      ids: {
                        trakt: traktInfo.info.ids.trakt,
                      },
                      seasons: [
                        {
                          number: season.number,
                        },
                      ],
                    },
                  ],
                });
              })();
            }}
            style={{
              marginLeft: 20,
              position: "relative",
              zIndex: 400,
            }}
            color="dark"
            fill="clear"
            size="small"
          >
            Mark as unwatched
          </IonButton>
        ) : (
          <IonButton
            onClick={() => {
              (async () => {
                setProgress(1);
                await trakt.sync.history.add({
                  shows: [
                    {
                      ids: {
                        trakt: traktInfo.info.ids.trakt,
                      },
                      seasons: [
                        {
                          number: season.number,
                        },
                      ],
                    },
                  ],
                });
              })();
            }}
            style={{
              marginLeft: 20,
              position: "relative",
              zIndex: 400,
            }}
            color="dark"
            fill="clear"
            size="small"
          >
            Mark as watched
          </IonButton>
        )}
      </div>

      <IonButton
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
        }}
        fill="clear"
        color="dark"
        href={`/show/${traktInfo.info.ids.trakt}/season/${season.number}`}
      >
        <IonProgressBar
          style={{ height: 10, borderRadius: 10, marginRight: 20 }}
          value={progress}
        />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: 200,
          }}
        >
          <p
            style={{
              fontSize: 20,
              whiteSpace: "nowrap",
            }}
          >
            {season.completed} / {season.aired}
          </p>
          <IonButton
            style={{ marginLeft: 10 }}
            fill="clear"
            color="dark"
            href={`/show/${traktInfo.info.ids.trakt}/season/${season.number}`}
          >
            <IonIcon icon={chevronForward} size="large" />
          </IonButton>
        </span>
      </IonButton>
    </div>
  );
}
