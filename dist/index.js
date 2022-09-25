"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const app_1 = require("./app");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
function mountedHTML(html) {
    const template = fs_1.default.readFileSync("./index.html", "utf-8");
    const appHTML = template.replace("<!--app-outlet-->", html);
    return appHTML;
}
function componentize(obj) {
    if (Array.isArray(obj)) {
        return obj
            .map((ob) => {
            if (typeof ob.type !== "symbol") {
                if (!ob.props)
                    return "";
                return `<${ob.type}>${typeof ob.props.children === "string"
                    ? ob.props.children
                    : ob.props.children
                        .map((child) => {
                        if (typeof child === "string")
                            return child;
                        return componentize(child);
                    })
                        .join("")}</${ob.type}>`;
            }
            else {
                return componentize(ob.props.children);
            }
        })
            .join("");
    }
    else {
        if (typeof obj.type !== "symbol") {
            if (!obj.props)
                return "";
            return `<${obj.type}>${typeof obj.props.children === "string"
                ? obj.props.children
                : obj.props.children
                    .map((child) => {
                    if (typeof child === "string")
                        return child;
                    return componentize(child);
                })
                    .join("")}</${obj.type}>`;
        }
        else {
            return componentize(obj.props.children);
        }
    }
}
async function startServer() {
    try {
        const app = (0, app_1.createApp)();
        const basename = "pages";
        const routes = Object.values(glob_1.default.sync("**/pages/*")).map((url) => {
            const name = url.slice(url.indexOf(basename) + basename.length, url.indexOf("."));
            return name === "/index" ? "/" : name;
        });
        app.use(routes, async (req, res) => {
            const url = path_1.default.resolve(__dirname, `${basename}${req.originalUrl === "/" ? "/index" : req.originalUrl}`);
            const module = await Promise.resolve().then(() => __importStar(require(url)));
            if (module) {
                const def = module.default();
                const html = componentize(def);
                const resHTML = mountedHTML(html);
                res.on("error", (error) => {
                    res.status(500).end(error);
                });
                res.end(resHTML);
            }
        });
        app.listen(process.env.PORT || 3000);
    }
    catch (error) {
        console.error(error);
    }
}
exports.startServer = startServer;
startServer();
//# sourceMappingURL=index.js.map