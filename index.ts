import { createApp } from "./app"
import fs from "fs"
import path from "path"
import glob from "glob"
import ErrorPage from "./src/pages/404"

function mountedHTML(html: string) {
  const template = fs.readFileSync("./index.html", "utf-8")

  const appHTML = template.replace("<!--app-outlet-->", html)

  return appHTML
}

function componentize(obj: JSX.Element | JSX.Element[]): string {
  if (Array.isArray(obj)) {
    return obj
      .map((ob) => {
        if (typeof ob.type !== "symbol") {
          if (!ob.props) return ""
          return `<${ob.type}>${
            typeof ob.props.children === "string"
              ? ob.props.children
              : ob.props.children
                  .map((child: any) => {
                    if (typeof child === "string") return child
                    return componentize(child)
                  })
                  .join("")
          }</${ob.type}>`
        } else {
          return componentize(ob.props.children)
        }
      })
      .join("")
  } else {
    if (typeof obj.type !== "symbol") {
      if (!obj.props) return ""
      return `<${obj.type}>${
        typeof obj.props.children === "string"
          ? obj.props.children
          : obj.props.children
              .map((child: any) => {
                if (typeof child === "string") return child
                return componentize(child)
              })
              .join("")
      }</${obj.type}>`
    } else {
      return componentize(obj.props.children)
    }
  }
}

export async function startServer() {
  const app = createApp()

  const basename = "pages"

  const routes = Object.values(glob.sync("src/pages/*.tsx")).map((url) => {
    const name = url.slice(
      url.indexOf(basename) + basename.length,
      url.indexOf(".")
    )

    return name === "/index" ? "/" : name
  })

  app.use(routes, async (req, res) => {
    const url = path.resolve(
      __dirname,
      `src/${basename}${req.originalUrl === "/" ? "/index" : req.originalUrl}`
    )

    try {
      const module = await import(url)

      if (module) {
        const def: JSX.Element = module.default()

        const html = componentize(def)

        const resHTML = mountedHTML(html)

        res.on("error", (error) => {
          res.status(500).end(error)
        })

        res.end(resHTML)
      }
    } catch (error) {
      const def: JSX.Element = ErrorPage()

      const html = componentize(def)

      const resHTML = mountedHTML(html)

      res.end(resHTML)

      console.error(error)
    }
  })

  app.listen(process.env.PORT || 3000)
}

startServer()
