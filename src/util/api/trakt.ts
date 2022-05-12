// @ts-ignore
import Trakt from "nodeless-trakt";

const options = {
  client_id: process.env.TRAKT_CLIENT_ID,
  client_secret: process.env.TRAKT_CLIENT_SECRET,
  redirect_uri: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ionic-dionysus.pages.dev"
  }/callback/trakt`,
  api_url: null, // defaults to 'https://api.trakt.tv'
  useragent: null, // defaults to 'trakt.tv/<version>'
  pagination: true, // defaults to false, global pagination (see below)
};
const trakt = new Trakt(options);

export default trakt;
