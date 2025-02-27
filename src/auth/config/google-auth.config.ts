/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
export default registerAs('googleAuth', () => {
  return {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  };
});