import { OAuth2Client } from "google-auth-library";

export const oauth = (async (authCode) => {
    const oauth2Client = new OAuth2Client({
        clientId: '65418245861-2e1ofmjjaqe4glkc3q8k8ijducq8qg23.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: 'http://localhost:3000/home'
      })
    
      let { tokens } = await oauth2Client.getToken(authCode)
      client.setCredentials({ access_token: tokens.access_token })
    
      const userInfo = await oauth2Client
        .request({
          url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        })
        .then((response) => response.data)
        .catch(() => null)
    
      oauth2Client.revokeCredentials()
    
      return {
        id: userInfo.sub,
        name: userInfo.name,
        avatar: userInfo.picture,
        email: userInfo.email,
        emailVerified: userInfo.email_verified,
      }
})