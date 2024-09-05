import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET);

export const getGoogleInfo = async (token) => {
  try {
    client.setCredentials({ access_token: token });

    const response = await client.request({ url: "https://www.googleapis.com/oauth2/v3/userinfo" });

    return response.data;
  } catch (error) {
    return null;
  }
}
