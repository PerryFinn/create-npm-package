import type { Changeset, CommitFunctions, ReleasePlan } from "@changesets/types";

type SkipCI = boolean | "add" | "version";

const getAddMessage: CommitFunctions["getAddMessage"] = async (
  changeset: Changeset,
  options: { skipCI?: SkipCI } | null
) => {
  const skipCI = options?.skipCI === "add" || options?.skipCI === true;
  const skipMsg = skipCI ? "\n\n[skip ci]\n" : "";
  return `docs(changeset): ${changeset.summary}${skipMsg}`;
};

const getVersionMessage: CommitFunctions["getVersionMessage"] = async (
  releasePlan: ReleasePlan,
  options: { skipCI?: SkipCI } | null
) => {
  const skipCI = options?.skipCI === "version" || options?.skipCI === true;
  const publishableReleases = releasePlan.releases.filter((release) => release.type !== "none");
  const numPackagesReleased = publishableReleases.length;

  if (publishableReleases.length === 1) {
    const release = publishableReleases[0];
    if (!release) {
      throw new Error("release info is undefined");
    }
    return `chore(release): ${release.name}@${release.newVersion}`;
  }

  const releasesLines = publishableReleases.map((release) => `  ${release.name}@${release.newVersion}`).join("\n");

  return `chore(release): releasing ${numPackagesReleased} package(s)

Releases:
${releasesLines}
${skipCI ? "\n[skip ci]\n" : ""}`;
};

const defaultCommitFunctions: Required<CommitFunctions> = {
  getAddMessage,
  getVersionMessage
};

export default defaultCommitFunctions;
