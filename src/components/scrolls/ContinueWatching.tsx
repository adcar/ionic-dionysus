import React, { useState } from "react";
import trakt from "../../util/api/trakt";
import tmdb from "../../util/api/tmdb";
import useAsyncEffect from "use-async-effect";
import PlayableCard from "../PlayableCard";
import HorizScroll from "../HorizScroll";
import empty from "../../assets/undraw_empty.svg";
import { IonSkeletonText } from "@ionic/react";
import dummyArray from "./dummyArray";

interface IShowIds {
  trakt: string;
  tmdb: string;
}

export default function ContinueWatchilengthng() {
  const [shows, setShows]: any[] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useAsyncEffect(async () => {
    const shows = await trakt.sync.watched({ type: "shows", limit: 15 });

    if (shows.length < 1) {
      setLoaded(true);
      return;
    }

    const showIds = shows.map(
      (show: { show: { ids: IShowIds } }) => show.show.ids
    );

    const tmdbPromises = showIds.map((showIds: IShowIds) => {
      return tmdb(`/tv/${showIds.tmdb}`);
    });

    const traktPromises = showIds.map((showIds: IShowIds) => {
      return trakt.shows.progress.watched({
        id: showIds.trakt,
        extended: "full",
      });
    });

    const showElements: any[] = [];
    const width = 342;

    let promises = [Promise.all(traktPromises), Promise.all(tmdbPromises)];

    await Promise.all(promises).then((info: any) => {
      const traktInfo: any = info[0];
      const tmdbInfo = info[1];

      tmdbInfo.forEach((tmdbShow: any, index: number) => {
        const showId = showIds[index];

        // The next_episode is null if they finished the show
        if (traktInfo[index].next_episode === null) {
          return;
        }

        const firstAired = new Date(traktInfo[index].next_episode.first_aired);

        // If the first air date is in the future, don't render the card
        if (firstAired > new Date()) {
          return;
        }
        showElements.push(
          <PlayableCard
            key={showId.trakt}
            traktId={showId.trakt}
            bgUrl={
              tmdbShow.backdrop_path !== null
                ? `https://image.tmdb.org/t/p/w${width}${tmdbShow.backdrop_path}`
                : null
            }
            name={tmdbShow.name}
            episode={traktInfo[index].next_episode.number}
            season={traktInfo[index].next_episode.season}
            year={
              tmdbShow.first_air_date !== null
                ? parseInt(tmdbShow.first_air_date.slice(0, 4))
                : null
            }
            episodeId={traktInfo[index].next_episode.ids.trakt}
          />
        );
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
        <p style={{ margin: 0 }}>
          Shows you can continue watching will appear here
        </p>
        <img src={empty} alt="Empty" style={{ height: 150, width: 300 }} />
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
        Continue Watching
      </h1>
      {content}
    </>
  );
}
