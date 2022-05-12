import React, { useState } from "react";
import {
  IonButton,
  IonIcon,
  IonLoading,
  IonPopover,
  IonList,
  IonItem,
} from "@ionic/react";
import { play, checkmarkCircle, ellipsisVertical } from "ionicons/icons";
import truncate from "truncate";
import Modal from "./Modal";
import trakt from "../util/api/trakt";

interface IProps {
  bgUrl: string | null;
  season: number;
  episode: number;
  episodeName: string;
  showName: string;
  seen: boolean;
  reference?: any;
  episodeId: number;
  showId: number;
}

export default function PlayableCard({
  episodeId,
  showId,
  bgUrl,
  season,
  episode,
  showName,
  episodeName,
  seen,
  reference,
}: IProps) {
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({
    open: false,
    event: undefined,
  });
  const [links, setLinks]: any[] = useState([]);
  const [isWatched, setWatched] = useState(seen);

  return (
    <div
      ref={reference}
      style={{
        position: "relative",
      }}
    >
      <IonLoading isOpen={isLoading} message={"Please wait..."} />
      <IonButton
        onClick={async () => {
          setLoading(true);
        }}
        className="show"
        style={
          bgUrl !== null
            ? {
                "--background": `linear-gradient(rgba(0,0,0,${
                  isWatched ? "0.8" : "0.5"
                }), rgba(0,0,0,${isWatched ? "0.8" : "0.5"})), url(${bgUrl})`,
              }
            : {}
        }
      >
        {isWatched ? (
          <IonIcon size={"large"} icon={checkmarkCircle} className="check" />
        ) : (
          ""
        )}
        <IonIcon icon={play} className="play" />
        <div className="showDetails">
          <h2>
            S{season}:E{episode}
          </h2>
          <p>{truncate(episodeName, 35)}</p>
        </div>
      </IonButton>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        episodeId={episodeId}
        setLoading={setLoading}
        links={links}
      />
      <IonButton
        color="dark"
        fill="clear"
        style={{ position: "absolute", top: 20, right: 10 }}
        onClick={(e) => {
          e.persist();
          setShowPopover({ open: true, event: e.nativeEvent });
        }}
      >
        <IonIcon icon={ellipsisVertical} />
      </IonButton>
      <IonPopover
        isOpen={showPopover.open}
        event={showPopover.event}
        cssClass="my-custom-class"
        onDidDismiss={(e) => setShowPopover({ open: false, event: undefined })}
      >
        <IonList>
          <IonItem>
            <IonButton
              color="dark"
              fill="clear"
              onClick={async () => {
                setShowModal(true);
              }}
            >
              Choose Source
            </IonButton>
          </IonItem>
          <IonItem>
            {isWatched ? (
              <IonButton
                color="dark"
                fill="clear"
                onClick={() => {
                  (async () => {
                    setWatched(false);
                    setShowPopover({ open: false, event: undefined });
                    await trakt.sync.history.remove({
                      episodes: [
                        {
                          ids: {
                            trakt: episodeId,
                          },
                        },
                      ],
                    });
                  })();
                }}
              >
                Mark as unwatched
              </IonButton>
            ) : (
              <IonButton
                color="dark"
                fill="clear"
                onClick={() => {
                  (async () => {
                    setWatched(true);
                    setShowPopover({ open: false, event: undefined });
                    await trakt.sync.history.add({
                      episodes: [
                        {
                          ids: {
                            trakt: episodeId,
                          },
                        },
                      ],
                    });
                  })();
                }}
              >
                Mark as watched
              </IonButton>
            )}
          </IonItem>
        </IonList>
      </IonPopover>
    </div>
  );
}
