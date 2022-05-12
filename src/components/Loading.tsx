import "./Loading.css";
import React from "react";
import { IonSpinner, IonProgressBar } from "@ionic/react";

interface IProps {
  title: string;
  msg: string;
  progress: number;
}

export default function Loading({ title, msg, progress }: IProps) {
  return (
    <div className="loading">
      <div className="box">
        <div className="inner-box">
          <IonSpinner
            style={{
              marginLeft: 20,
            }}
          />
          <div>
            <h1>{title}</h1>
            <span>{msg}</span>
          </div>
        </div>
        {progress !== -1 ? (
          <IonProgressBar
            value={progress}
            style={{
              borderRadius: 20,
            }}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
