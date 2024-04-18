import { OAuth2Client } from "google-auth-library";

// export const oauth = (async (authCode) => {
//     const oauth2Client = new OAuth2Client({
//         clientId: '65418245861-2e1ofmjjaqe4glkc3q8k8ijducq8qg23.apps.googleusercontent.com',
//         clientSecret: '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',
//         redirectUri: 'http://localhost:3000/home'
//       })
    
//       let { tokens } = await oauth2Client.getToken(authCode)
//       client.setCredentials({ access_token: tokens.access_token })
    
//       const userInfo = await oauth2Client
//         .request({
//           url: 'https://www.googleapis.com/oauth2/v3/userinfo'
//         })
//         .then((response) => response.data)
//         .catch(() => null)
    
//       oauth2Client.revokeCredentials()
    
//       return {
//         id: userInfo.sub,
//         name: userInfo.name,
//         avatar: userInfo.picture,
//         email: userInfo.email,
//         emailVerified: userInfo.email_verified,
//       }
// })


export const oauth = async (req, res) => {
  const authCode = req.body.authCode; // Assuming authCode is sent in the request body

  const oauth2Client = new OAuth2Client({
      clientId: '放你的ClientID',
      clientSecret: '放你的密鑰',
      redirectUri: '放你要導向的uri'
  });

  try {
      let { tokens } = await oauth2Client.getToken({ code: authCode });
      oauth2Client.setCredentials({ access_token: tokens.access_token });

      const userInfoResponse = await oauth2Client.request({
          url: 'https://www.googleapis.com/oauth2/v3/userinfo'
      });

      const userInfo = userInfoResponse.data;

      // Check if userInfo is not null before accessing its properties
      if (userInfo) {
          const user = {
              id: userInfo.sub,
              name: userInfo.name,
              avatar: userInfo.picture,
              email: userInfo.email,
              emailVerified: userInfo.email_verified,
          };

          res.status(200).json(user);
      } else {
          res.status(500).json({ error: 'Failed to fetch user information' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};