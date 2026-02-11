require('dotenv').config();

import * as env from 'env-var'

export const serverConfig = {
  port: env.get('PORT_FINANCIAL_CONTROL').default(3000).asPortNumber()
}

export const firebaseConfig = {
  projectId: env.get('FIREBASE_PROJECT_ID').required().asString(),
  clientEmail: env.get('FIREBASE_CLIENT_EMAIL').required().asString(),
  privateKey: env.get('FIREBASE_PRIVATE_KEY').required().asString().replace(/\\n/g, '\n'),
}

export const keysToken = {
  at_private_key: env.get('ACCESS_TOKEN_PRIVATE_KEY').required().asString(),
  at_public_key: env.get('ACCESS_TOKEN_PUBLIC_KEY').required().asString(),
  rt_private_key: env.get('REFRESH_TOKEN_PRIVATE_KEY').required().asString(),
  rt_public_key: env.get('REFRESH_TOKEN_PUBLIC_KEY').required().asString(),
}