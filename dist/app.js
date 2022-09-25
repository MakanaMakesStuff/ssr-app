"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
function createApp(port, plugins) {
    const app = (0, express_1.default)();
    if (plugins)
        app.use(plugins);
    if (port)
        app.listen(port);
    return app;
}
exports.createApp = createApp;
//# sourceMappingURL=app.js.map