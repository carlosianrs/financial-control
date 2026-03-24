export const serverConfig = {
  host: process.env.HOST_SERVER,
  port: Number(process.env.PORT_SERVER),
  TOKEN: 'financial-control:token',
  rt_token: process.env.REFRESH_TOKEN_PUBLIC_KEY,
}