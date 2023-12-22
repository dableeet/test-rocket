export default () => {
  const { API_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, AUTH_CODE } =
    process.env;

  return {
    requestParams: {
      url: API_URL,
      code: AUTH_CODE,
      body: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      },
    },
  };
};
