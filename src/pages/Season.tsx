import React, { useState } from "react";
import { IonPage, IonContent, IonIcon, IonButton } from "@ionic/react";
import useAsyncEffect from "use-async-effect";
import trakt from "../util/api/trakt";
import tmdb from "../util/api/tmdb";
import PlayableEpisodeCard from "../components/PlayableEpisodeCard";
import { star, chevronBack } from "ionicons/icons";

export default function Season({ match }: any) {
  const [tmdbInfo, setTmdbInfo] = useState({
    episodes: [
      {
        still_path: "",
        name: "",
        overview: "",
        air_date: "",
        vote_average: 0,
        vote_count: 0,
      },
    ],
  });
  const [showInfo, setShowInfo] = useState({
    title: "",
    year: 0,
    ids: { trakt: 0 },
  });
  const [seasonInfo, setSeasonsInfo] = useState({
    complted: 0,
    seasons: [
      {
        aired: 0,
        completed: 0,
        episodes: [
          {
            number: 1,
            completed: false,
            last_watched_at: null,
            ids: {
              trakt: 0,
            },
          },
        ],
      },
    ],
  });
  const [seasons, setSeasons] = useState([
    { episodes: [{ ids: { trakt: 0 } }] },
  ]);
  const id = match.params.id;
  const season = match.params.season;

  useAsyncEffect(async () => {
    const promises = [];

    promises.push(
      trakt.shows.progress.watched({
        id,
        specials: false,
      })
    );

    promises.push(
      trakt.shows.summary({
        id,
      })
    );

    promises.push(
      trakt.seasons.summary({
        id,
        extended: "episodes",
      })
    );

    Promise.all(promises).then(async (allRes) => {
      setSeasonsInfo(allRes[0]);
      setShowInfo(allRes[1]);

      // If there is a season 0, remove it
      if (allRes[2][0].number === 0) {
        setSeasons(allRes[2].shift());
      }

      setSeasons(allRes[2]);

      const res = await tmdb(`/tv/${allRes[1].ids.tmdb}/season/${season}`);
      setTmdbInfo(res);
    });
  }, []);
  return (
    <IonPage>
      <IonContent>
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <IonButton
              style={{ marginRight: 20 }}
              fill="clear"
              color="dark"
              size="large"
              href={`/show/${id}`}
            >
              <IonIcon icon={chevronBack} />
            </IonButton>
            <h1 style={{ margin: 0 }}>{showInfo.title}</h1>
          </div>
          <h2>Season {season}</h2>

          {seasonInfo.seasons[season - 1] &&
          seasonInfo.seasons[season - 1].episodes.length > 1 &&
          tmdbInfo.episodes.length > 1
            ? seasonInfo.seasons[season - 1].episodes.map(
                (episode: any, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      <PlayableEpisodeCard
                        bgUrl={`https://image.tmdb.org/t/p/w342${
                          tmdbInfo.episodes[episode.number - 1].still_path
                        }`}
                        season={season}
                        episode={episode.number}
                        showName={showInfo.title}
                        episodeName={tmdbInfo.episodes[episode.number - 1].name}
                        seen={episode.completed}
                        episodeId={
                          seasons[season - 1].episodes[episode.number - 1].ids
                            .trakt
                        }
                        showId={showInfo.ids.trakt}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: 342,
                          marginBottom: 40,
                          marginLeft: 20,
                        }}
                      >
                        <p>{tmdbInfo.episodes[episode.number - 1].overview}</p>

                        <p style={{ margin: 0 }}>
                          <IonIcon
                            icon={star}
                            style={{
                              marginRight: 10,
                              position: "relative",
                              bottom: -1,
                            }}
                          />
                          {tmdbInfo.episodes[
                            episode.number - 1
                          ].vote_average.toPrecision(2)}{" "}
                          <span style={{ marginRight: 10, marginLeft: 10 }}>
                            •
                          </span>{" "}
                          {tmdbInfo.episodes[episode.number - 1].air_date}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            : ""}
        </div>
      </IonContent>
    </IonPage>
  );
}
