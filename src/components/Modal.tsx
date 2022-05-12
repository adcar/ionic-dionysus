import { IonModal, IonButton, IonSpinner } from "@ionic/react";
import React, { useContext, useState, useRef } from "react";
import { playLink } from "../util/api/filepursuit";
import { basename } from "path";
import RefContext from "../context";
interface IProps {
  showModal: boolean;
  setShowModal: any;
  setLoading: any;
  links: string[];
  episodeId: number;
}
export default function Modal({
  showModal,
  setShowModal,
  setLoading,
  links,
  episodeId,
}: IProps) {
  const pageRef = useContext(RefContext);
  const [canSwipe, setCanSwipe] = useState(true);
  const modalRef: any = useRef(null);

  return (
    <IonModal
      isOpen={showModal}
      swipeToClose={canSwipe}
      presentingElement={pageRef.current as any}
      mode="ios"
      onDidDismiss={() => setShowModal(false)}
    >
      <div
        ref={modalRef}
        className="horiz"
        style={{
          padding: 10,
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onScroll={(e) => {
          if (modalRef !== null && modalRef.current !== null) {
            if (modalRef.current.scrollTop < 20) {
              setCanSwipe(true);
            } else if (canSwipe === true) {
              setCanSwipe(false);
            }
          }
        }}
      >
        <div
          style={{
            height: 6,
            width: 60,
            backgroundColor: "var(--ion-text-color)",
            borderRadius: 10,
            margin: "5px auto 0 auto",
          }}
        />

        <h1
          style={{
            marginTop: 10,
            paddingLeft: 10,
          }}
        >
          Choose your source
        </h1>
        {links.length > 0 ? (
          links.map((link: string, index: number) => (
            <button
              onClick={async () => {
                setLoading(true);
                await playLink(link, episodeId);
                setLoading(false);
              }}
              key={index}
              style={{
                borderBottom: "solid var(--ion-border-color) 1px",
                width: "100%",
                backgroundColor: "transparent",
                outline: "0",
                color: "var(--ion-text-color)",
                textAlign: "left",
              }}
            >
              <h4>{basename(link)}</h4>
              <p
                style={{
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {link}
              </p>
            </button>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <IonSpinner />
          </div>
        )}
      </div>

      <IonButton fill="clear" onClick={() => setShowModal(false)}>
        Cancel
      </IonButton>
    </IonModal>
  );
}
