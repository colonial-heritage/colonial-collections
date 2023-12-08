'use server';

import {auth} from '@clerk/nextjs';
import {jwtDecode} from 'jwt-decode';

const dateTimeFormat = new Intl.DateTimeFormat('nl', {
  dateStyle: 'full',
  timeStyle: 'long',
});

export async function backendLogAction() {
  const {getToken, sessionId, session, userId} = await auth();
  const token = await getToken();
  const tokenDecoded = token ? jwtDecode(token) : null;
  const date = dateTimeFormat.format(tokenDecoded?.exp * 1000);
  console.log('DEBUG BUTTON CLICKED: BACKEND', {
    date,
    token,
    tokenDecoded,
    sessionId,
    session,
    userId,
  });
}
