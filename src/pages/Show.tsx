import React, { useState, useCallback, useRef } from "react";
import useAsyncEffect from "use-async-effect";
import trakt from "../util/api/trakt";
import tmdb from "../util/api/tmdb";
import {
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonPage,
  IonContent,
  IonSkeletonText,
  IonToast,
} from "@ionic/react";

import { chevronBack, star } from "ionicons/icons";
import HorizScroll from "../components/HorizScroll";
import PlayableEpisodeCard from "../components/PlayableEpisodeCard";
import RefContext from "../context";
import SeasonProgress from "../components/SeasonProgress";
import dummyArray from "../components/scrolls/dummyArray";

export default function Show({ match }: any) {
  const pageRef = useRef(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [tmdbInfo, setTmdbInfo] = useState({
    info: {
      backdrop_path: null,
    },
    season: {
      episodes: [
        {
          still_path: null,
          name: "",
        },
      ],
    },
  });
  const [traktInfo, setTraktInfo] = useState({
    info: {
      ids: {
        trakt: 0,
      },
      title: "",
      year: 0,
      rating: 0,
      runtime: 0,
      genres: [],
      overview: "",
    },
    progress: {
      next_episode: {
        number: 1,
        season: 1,
      },
      seasons: [{ number: 0, aired: 0, completed: 0, episodes: [] }],
    },
    seasons: [
      {
        episodes: [
          {
            ids: {
              trakt: 0,
            },
          },
        ],
      },
    ],
    watchlist: [
      {
        show: {
          ids: {
            trakt: "",
          },
        },
      },
    ],
  });

  const epRef = useCallback((node) => {
    if (node !== null) {
      node.scrollIntoView({
        behavior: "smooth",
        // block: "end",
        block: "nearest",
        // inline: "nearest",
      });
    }
  }, []);

  useAsyncEffect(async () => {
    try {
      const promises = [];

      const id = match.params.id;

      promises.push(
        trakt.shows.summary({
          id,
          extended: "full",
        })
      );

      promises.push(
        trakt.shows.progress.watched({
          id,
        })
      );

      promises.push(
        trakt.seasons.summary({
          id,
          extended: "episodes",
        })
      );

      promises.push(trakt.sync.watchlist.get({ type: "shows" }));
      await Promise.all(promises).then(async (allRes) => {
        // If there is a season 0, remove it
        if (allRes[2][0].number === 0) {
          allRes[2].shift();
        }
        setTraktInfo({
          info: allRes[0],
          progress: allRes[1],
          seasons: allRes[2],
          watchlist: allRes[3],
        });
        const tmdbInfo = await tmdb(`/tv/${allRes[0].ids.tmdb}`);

        // The next_episode is null if they finished the show
        let seasonInfo: any = "";
        if (allRes[1].next_episode !== null) {
          seasonInfo = await tmdb(
            `/tv/${allRes[0].ids.tmdb}/season/${allRes[1].next_episode.season}`
          );
        } else {
          seasonInfo = null;
        }

        setTmdbInfo({
          info: tmdbInfo,
          season: seasonInfo,
        });
      });

      setLoaded(true);
    } catch (e) {
      console.error("Something went wrong", e);
      setShowToast(true);
    }
  }, []);

  useAsyncEffect(async () => {
    if (
      traktInfo.watchlist.find(
        (show: any) => show.show.ids.trakt === traktInfo.info.ids.trakt
      ) !== undefined
    ) {
      setIsInWatchlist(true);
    }
  }, [traktInfo]);

  const seasons = traktInfo.progress.seasons.length;
  return (
    <IonPage ref={pageRef} className="show-page">
      <RefContext.Provider value={pageRef}>
        <IonContent>
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="An unknown error occured. Please try again"
          />
          <header
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,1)), url(${
                tmdbInfo.info.backdrop_path !== null
                  ? `https://image.tmdb.org/t/p/original${tmdbInfo.info.backdrop_path}`
                  : null
              })`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <IonButton fill="clear" color="dark" size="large" href="/shows">
                <IonIcon icon={chevronBack} />
              </IonButton>

              {isInWatchlist ? (
                <IonButton
                  color="dark"
                  style={{ marginRight: 20 }}
                  onClick={async () => {
                    setIsInWatchlist(false);
                    trakt.sync.watchlist.remove({
                      shows: [
                        {
                          ids: {
                            trakt: traktInfo.info.ids.trakt,
                          },
                        },
                      ],
                    });
                  }}
                >
                  Remove from watchlist
                </IonButton>
              ) : (
                <IonButton
                  color="dark"
                  style={{ marginRight: 20 }}
                  onClick={async () => {
                    setIsInWatchlist(true);
                    trakt.sync.watchlist.add({
                      shows: [
                        {
                          ids: {
                            trakt: traktInfo.info.ids.trakt,
                          },
                        },
                      ],
                    });
                  }}
                >
                  Add to watchlist
                </IonButton>
              )}
            </div>

            <div
              style={{
                padding: 10,
                width: "100%",
              }}
            >
              {isLoaded ? (
                <h1
                  style={{
                    fontSize: 42,
                  }}
                >
                  {traktInfo.info.title}
                </h1>
              ) : (
                <IonSkeletonText
                  animated
                  style={{
                    width: 200,
                    height: 42,
                    marginBottom: 30,
                  }}
                />
              )}

              {isLoaded ? (
                <p style={{ fontSize: 20 }}>
                  {seasons} season{seasons !== 1 ? "s" : ""}{" "}
                  <span
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    •
                  </span>{" "}
                  {traktInfo.info.runtime} mins per episode
                </p>
              ) : (
                <IonSkeletonText
                  animated
                  style={{
                    width: 300,
                    height: 20,
                    marginBottom: 30,
                  }}
                />
              )}

              {isLoaded ? (
                <p
                  style={{
                    fontSize: 20,
                    whiteSpace: "nowrap",
                    width: "100%",
                    overflowX: "auto",
                    marginBottom: 0,
                  }}
                >
                  <IonIcon
                    icon={star}
                    style={{
                      marginRight: 5,
                      verticalAlign: "center",
                      position: "relative",
                      top: 1,
                    }}
                  />
                  {traktInfo.info.rating.toPrecision(2)}

                  {traktInfo.info.genres.map((genre, index) => (
                    <IonChip color="dark" key={index}>
                      <IonLabel>{genre}</IonLabel>
                    </IonChip>
                  ))}
                </p>
              ) : (
                <IonSkeletonText
                  animated
                  style={{
                    width: 300,
                    height: 25,
                  }}
                />
              )}
            </div>
          </header>

          {isLoaded ? (
            <div
              style={{
                padding: 10,
                marginTop: 10,
                marginBottom: 10,
                maxWidth: 800,
              }}
            >
              {traktInfo.info.overview}
            </div>
          ) : (
            <>
              <IonSkeletonText
                animated
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  marginLeft: 10,

                  width: "75%",
                  height: 20,
                }}
              />
              <IonSkeletonText
                animated
                style={{
                  padding: 10,
                  marginBottom: 10,
                  marginLeft: 10,

                  width: "80%",
                  height: 20,
                }}
              />
              <IonSkeletonText
                animated
                style={{
                  padding: 10,
                  marginBottom: 10,
                  marginLeft: 10,

                  width: "78%",
                  height: 20,
                }}
              />
            </>
          )}

          {isLoaded ? (
            traktInfo.progress.next_episode !== null ? (
              <>
                <h2 style={{ paddingLeft: 10 }}>Next episode</h2>
                <HorizScroll>
                  {tmdbInfo.season.episodes.length > 1
                    ? traktInfo.progress.seasons[
                        traktInfo.progress.next_episode.season - 1
                      ].episodes.map((episode: any, index) => {
                        return (
                          <PlayableEpisodeCard
                            key={index}
                            bgUrl={`https://image.tmdb.org/t/p/w342${
                              tmdbInfo.season.episodes[episode.number - 1]
                                .still_path
                            }`}
                            season={traktInfo.progress.next_episode.season}
                            episode={episode.number}
                            showName={traktInfo.info.title}
                            episodeName={
                              tmdbInfo.season.episodes[episode.number - 1].name
                            }
                            seen={episode.completed}
                            reference={
                              episode.number ===
                              traktInfo.progress.next_episode.number
                                ? epRef
                                : null
                            }
                            episodeId={
                              traktInfo.seasons[
                                traktInfo.progress.next_episode.season - 1
                              ].episodes[episode.number - 1].ids.trakt
                            }
                            showId={traktInfo.info.ids.trakt}
                          />
                        );
                      })
                    : ""}
                </HorizScroll>
              </>
            ) : (
              <div style={{ padding: 10 }}>
                <h1>You're up to date!</h1>
                <p>You've seen every episode of this show</p>
              </div>
            )
          ) : (
            <>
              <h1 style={{ paddingLeft: 10 }}>Next Episode</h1>
              <HorizScroll>
                {dummyArray.map((x: number, index) => (
                  <IonSkeletonText
                    animated
                    className="show-skeleton"
                    key={index}
                  />
                ))}
              </HorizScroll>
            </>
          )}

          <div style={{ padding: 10 }}>
            <h2>Seasons</h2>
            <div>
              {isLoaded
                ? traktInfo.progress.seasons.map((season) => (
                    <SeasonProgress
                      traktInfo={traktInfo}
                      season={season}
                      key={season.number}
                    />
                  ))
                : dummyArray.map((x: number, index) => (
                    <IonSkeletonText
                      key={index}
                      style={{
                        boxSizing: "border-box",
                        height: 100,
                        marginTop: 20,
                        marginBottom: 20,
                        borderRadius: 10,
                      }}
                      animated
                    />
                  ))}
            </div>
          </div>
        </IonContent>
      </RefContext.Provider>
    </IonPage>
  );
}
