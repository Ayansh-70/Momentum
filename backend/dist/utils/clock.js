"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSimulatedTime = exports.setSimulatedTime = exports.getNow = void 0;
let isSimulated = false;
let simulatedTime = null;
const getNow = () => {
    if (isSimulated && simulatedTime !== null) {
        return new Date(simulatedTime).toISOString();
    }
    return new Date().toISOString();
};
exports.getNow = getNow;
const setSimulatedTime = (isoString) => {
    isSimulated = true;
    simulatedTime = new Date(isoString).getTime();
};
exports.setSimulatedTime = setSimulatedTime;
const clearSimulatedTime = () => {
    isSimulated = false;
    simulatedTime = null;
};
exports.clearSimulatedTime = clearSimulatedTime;
//# sourceMappingURL=clock.js.map