import React, { useState } from "react";
import trakt from "../../util/api/trakt";
import tmdb from "../../util/api/tmdb";
import useAsyncEffect from "use-async-effect";
import Card from "../Card";
import HorizScroll from "../HorizScroll";
import blank_canvas from "../../assets/undraw_blank_canvas.svg";
import dummyArray from "./dummyArray";
import { IonSkeletonText } from "@ionic/react";

export default function Watchlist() {
  const [shows, setShows]: any[] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useAsyncEffect(async () => {
    const showInfos = await trakt.sync.watchlist.get({ type: "shows" });

    let showPromises = showInfos.map((ep: any) => {
      if (ep !== undefined) {
        return tmdb(`/tv/${ep.show.ids.tmdb}`);
      } else {
        return null;
      }
    });

    showPromises = showPromises.filter(
      (showPromise: Promise<any>) => showPromise !== null
    );

    const showElements: any[] = [];
    const width = 342;

    await Promise.all(showPromises).then((shows: any[]) => {
      shows.forEach((show) => {
        if (show !== undefined) {
          const foundShow = showInfos.find(
            (ep: any) => ep.show.ids.tmdb === show.id
          );

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
              year={parseInt(show.first_air_date.slice(0, 4))}
            />
          );
        }
      });
    });

    setShows(showElements);
    setLoaded(true);
  }, []);

  let content;
  if (shows.length > 0 && isLoaded) {
    // regular
    content = <HorizScroll>{shows}</HorizScroll>;
  }

  if (shows.length === 0 && isLoaded) {
    // undraw
    content = (
      <div
        style={{
          marginLeft: 20,
          marginTop: 20,
          height: 192,
          display: "flex",

          flexDirection: "column",
        }}
      >
        <p style={{ margin: 0 }}>Shows in your watchlist will appear here</p>
        <img
          src={blank_canvas}
          alt="Black canvas"
          style={{ height: 150, width: 300 }}
        />
      </div>
    );
  }

  if (shows.length === 0 && !isLoaded) {
    // loading
    content = (
      <HorizScroll>
        {dummyArray.map((x: number, index) => (
          <IonSkeletonText animated className="show-skeleton" key={index} />
        ))}
      </HorizScroll>
    );
  }
  return (
    <>
      <h1
        style={{
          paddingLeft: 20,
        }}
      >
        My Watchlist
      </h1>
      {content}
    </>
  );
}
