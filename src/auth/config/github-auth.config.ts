/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
export default registerAs('githubAuth', () => {
  return {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  };
});