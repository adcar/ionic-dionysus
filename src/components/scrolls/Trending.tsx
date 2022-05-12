import React, { useState } from "react";
import trakt from "../../util/api/trakt";
import tmdb from "../../util/api/tmdb";
import useAsyncEffect from "use-async-effect";
import Card from ".././Card";
import HorizScroll from ".././HorizScroll";
import dummyArray from "./dummyArray";
import { IonSkeletonText } from "@ionic/react";

export default function Trending() {
  const [shows, setShows]: any[] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useAsyncEffect(async () => {
    const showInfos = await trakt.shows.trending();

    const showPromises = showInfos.map((ep: any) => {
      return tmdb(`/tv/${ep.show.ids.tmdb}`);
    });

    const showElements: any[] = [];
    const width = 154;

    await Promise.all(showPromises).then((shows: any[]) => {
      shows.forEach((show) => {
        const foundShow = showInfos.find(
          (ep: any) => ep.show.ids.tmdb === show.id
        );
        showElements.push(
          <Card
            key={foundShow.show.ids.trakt}
            traktId={foundShow.show.ids.trakt}
            bgUrl={
              show.poster_path !== null
                ? `https://image.tmdb.org/t/p/w${width}${show.poster_path}`
                : null
            }
            name={show.name}
            seasons={show.number_of_seasons}
            year={parseInt(show.first_air_date.slice(0, 4))}
            isPoster
          />
        );
      });
    });

    setShows(showElements);
    setLoaded(true);
  }, []);
  return (
    <>
      <h1
        style={{
          paddingLeft: 20,
        }}
      >
        Trending
      </h1>
      {shows.length > 0 && isLoaded ? (
        <HorizScroll>{shows}</HorizScroll>
      ) : (
        <HorizScroll>
          {dummyArray.map((x: number, index) => (
            <IonSkeletonText
              animated
              className="show-poster-skeleton"
              key={index}
            />
          ))}
        </HorizScroll>
      )}
    </>
  );
}
