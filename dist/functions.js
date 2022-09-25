"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSSR = void 0;
function isSSR() {
    return !(typeof window != "undefined" && window.document);
}
exports.isSSR = isSSR;
//# sourceMappingURL=functions.js.map