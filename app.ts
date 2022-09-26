import express from "express"

export function createApp(
  port?: number,
  plugins?: (() => any)[] | (() => any)
) {
  const app = express()

  if (plugins) app.use(plugins)

  if (port) app.listen(port)

  return app
}
