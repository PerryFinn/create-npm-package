const getAddMessage = async (changeset, options) => {
  const skipCI = options?.skipCI === "add" || options?.skipCI === true;
  const skipMsg = skipCI ? "\n\n[skip ci]\n" : "";
  return `docs(changeset): ${changeset.summary}${skipMsg}`;
};

const getVersionMessage = async (releasePlan, options) => {
  const skipCI = options?.skipCI === "version" || options?.skipCI === true;
  const publishableReleases = releasePlan.releases.filter((release) => release.type !== "none");
  const numPackagesReleased = publishableReleases.length;

  const releasesLines = publishableReleases.map((release) => `  ${release.name}@${release.newVersion}`).join("\n");

  return `chore(release): Releasing ${numPackagesReleased} package(s)

Releases:
${releasesLines}
${skipCI ? "\n[skip ci]\n" : ""}`;
};

const defaultCommitFunctions = {
  getAddMessage,
  getVersionMessage
};

export default defaultCommitFunctions;
