import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);

export const getGoogleInfo = async (code) => {
  try {
    let { tokens } = await client.getToken({ code: code });
    client.setCredentials({ access_token: tokens.access_token });

    const response = await client.request({ url: "https://www.googleapis.com/oauth2/v3/userinfo" });

    return response.data;
  } catch (error) {
    return null;
  }
}
