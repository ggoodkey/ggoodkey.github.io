var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./main"], function (require, exports, Application) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Application = __importStar(Application);
    // Try and load platform-specific code from the /merges folder.
    // More info at http://taco.visualstudio.com/en-us/docs/configure-app/#Content.
    require(["./platformOverrides"], function () { return Application.initialize(); }, function () { return Application.initialize(); });
});
//# sourceMappingURL=startup.js.map