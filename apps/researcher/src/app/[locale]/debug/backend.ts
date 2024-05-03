/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import {auth} from '@clerk/nextjs/server';
import {jwtDecode} from 'jwt-decode';

const dateTimeFormat = new Intl.DateTimeFormat('nl', {
  dateStyle: 'full',
  timeStyle: 'long',
});

export async function backendLogAction(frontendLog: any) {
  const {getToken, sessionId, userId} = auth();
  const token = await getToken();
  const tokenDecoded = token ? jwtDecode(token) : null;
  const date = tokenDecoded?.exp
    ? dateTimeFormat.format(tokenDecoded?.exp * 1000)
    : null;
  console.log('DEBUG BUTTON CLICKED: FRONTEND', frontendLog);
  console.log('DEBUG BUTTON CLICKED: BACKEND', {
    date,
    token,
    tokenDecoded,
    sessionId,
    userId,
  });
}
