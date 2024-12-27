"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/demo.ts
var demo_exports = {};
__export(demo_exports, {
  default: () => demo_default
});
module.exports = __toCommonJS(demo_exports);
var getAddMessage = async (changeset, options) => {
  const skipCI = options?.skipCI === "add" || options?.skipCI === true;
  const skipMsg = skipCI ? "\n\n[skip ci]\n" : "";
  return `docs(changeset): ${changeset.summary}${skipMsg}`;
};
var getVersionMessage = async (releasePlan, options) => {
  const skipCI = options?.skipCI === "version" || options?.skipCI === true;
  const publishableReleases = releasePlan.releases.filter((release) => release.type !== "none");
  const numPackagesReleased = publishableReleases.length;
  const releasesLines = publishableReleases.map((release) => `  ${release.name}@${release.newVersion}`).join("\n");
  return `chore(release): Releasing ${numPackagesReleased} package(s)

Releases:
${releasesLines}
${skipCI ? "\n[skip ci]\n" : ""}`;
};
var defaultCommitFunctions = {
  getAddMessage,
  getVersionMessage
};
var demo_default = defaultCommitFunctions;
//# sourceMappingURL=demo.cjs.map