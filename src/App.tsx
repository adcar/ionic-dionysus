import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { tv, film, heart } from "ionicons/icons";
import Shows from "./pages/Shows";
import Movies from "./pages/Movies";
import Favorites from "./pages/Favorites";
import TraktCallback from "./pages/callback/TraktCallback";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Custom CSS */
import "./styles/main.css";
import "./styles/horiz.css";
import "./styles/loading.css";

import Login from "./pages/Login";
import { Plugins } from "@capacitor/core";
import trakt from "./util/api/trakt";
import Show from "./pages/Show";
import Season from "./pages/Season";
import SearchResults from "./pages/SeachResults";

const { Storage } = Plugins;

const App: React.FC = () => {
  const [isAuthed, setAuthed] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("dark", true);
    (async () => {
      const { value } = await Storage.get({ key: "token" });

      if (value !== null) {
        await trakt.import_token(JSON.parse(value));
        setAuthed(true);
      }
    })();
  }, [isAuthed]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route
              path="/callback/trakt"
              render={({ history }) => (
                <TraktCallback history={history} setAuthed={setAuthed} />
              )}
            />
            <Route
              path="/"
              exact={true}
              render={() => {
                return isAuthed ? <Redirect to="/shows" /> : <Login />;
              }}
            />
            <Route
              path="/shows"
              exact={true}
              render={({ history }) =>
                isAuthed ? <Shows history={history} /> : <Login />
              }
            />
            <Route
              path="/show/:id"
              exact={true}
              render={(props) => (isAuthed ? <Show {...props} /> : <Login />)}
            />
            <Route
              path="/show/:id/season/:season"
              exact={true}
              render={(props) => (isAuthed ? <Season {...props} /> : <Login />)}
            />
            <Route
              path="/movies"
              exact={true}
              render={() => (isAuthed ? <Movies /> : <Login />)}
            />
            <Route
              path="/favorites"
              exact={true}
              render={() => (isAuthed ? <Favorites /> : <Login />)}
            />
            <Route
              path="/search/shows/:term?"
              exact={true}
              render={({ match, history }) =>
                isAuthed ? (
                  <SearchResults
                    type={"show"}
                    initialTerm={match.params.term}
                    history={history}
                  />
                ) : (
                  <Login />
                )
              }
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="shows" href="/shows">
              <IonIcon icon={tv} />
              <IonLabel>TV Shows</IonLabel>
            </IonTabButton>
            <IonTabButton tab="movies" href="/movies">
              <IonIcon icon={film} />
              <IonLabel>Movies</IonLabel>
            </IonTabButton>
            <IonTabButton tab="favorites" href="/favorites">
              <IonIcon icon={heart} />
              <IonLabel>My Favorites</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
