import React from "react";
import { IonButton } from "@ionic/react";
import truncate from "truncate";

interface IProps {
  traktId: number;
  bgUrl: string | null;
  name: string;
  seasons: number;
  year: number | null;
  isPoster?: boolean;
}

export default function Card({
  traktId,
  bgUrl,
  name,
  seasons,
  year,
  isPoster,
}: IProps) {
  const bgStyles =
    bgUrl !== null
      ? {
          "--background": `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgUrl})`,
          "--color:": "var(--ion-color-light)",
        }
      : {
          "--background": "var(--ion-color-light)",
        };

  const bgPosterStyles =
    bgUrl !== null
      ? {
          "--background": `url(${bgUrl})`,
          "--color:": "var(--ion-color-light)",
        }
      : {
          "--background": "var(--ion-color-light)",
        };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <IonButton
        href={`/show/${traktId}`}
        className={isPoster ? "show-poster" : "show"}
        style={isPoster ? bgPosterStyles : bgStyles}
      >
        <div className="showDetails">
          {isPoster ? (
            ""
          ) : (
            <>
              <h2>{truncate(name, 18)}</h2>{" "}
              <p>
                {seasons} seasons {year !== null ? `- ${year}` : ""}
              </p>
            </>
          )}
        </div>
      </IonButton>
    </div>
  );
}
