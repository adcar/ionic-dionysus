import React, { useState } from "react";
import { IonButton, IonIcon, IonLoading } from "@ionic/react";
import { play, menu } from "ionicons/icons";
import truncate from "truncate";

import startPlaying, { getLinksByShow } from "../util/api/filepursuit";
import Modal from "./Modal";

interface IProps {
  traktId: number;
  bgUrl: string | null;
  name: string;
  season: number;
  episode: number;
  year: number | null;
  episodeId: number;
}

export default function PlayableCard({
  traktId,
  bgUrl,
  name,
  season,
  episode,
  year,
  episodeId,
}: IProps) {
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [links, setLinks]: any[] = useState([]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <IonLoading isOpen={isLoading} message={"Please wait..."} />

      <IonButton
        onClick={async () => {
          setLoading(true);
          await startPlaying(name, episode, season, episodeId);
          setLoading(false);
        }}
        className="show"
        style={
          bgUrl !== null
            ? {
                "--background": `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgUrl})`,
              }
            : {}
        }
      >
        <IonIcon icon={play} className="play" />
        <div className="showDetails">
          <h2>{truncate(name, 18)}</h2>
          <p>
            S{season}:E{episode} {year !== null ? `- ${year}` : ""}
          </p>
        </div>
      </IonButton>
      <IonButton
        style={{ position: "absolute", top: 20, left: 10 }}
        fill="clear"
        color="dark"
        href={`/show/${traktId}`}
      >
        Episodes
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
        onClick={async () => {
          setShowModal(true);
          const newLinks = await getLinksByShow(name, episode, season);
          setLinks(newLinks);
        }}
      >
        <IonIcon icon={menu} />
      </IonButton>
    </div>
  );
}
