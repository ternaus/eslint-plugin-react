# Releasing

Publishing uses npm trusted publishing from the `Publish npm` GitHub workflow.
The npm package must first be configured with this repository as its trusted
publisher; no long-lived npm token belongs in GitHub secrets.

1. Set the intended semantic version in `package.json` and the plugin metadata
   in `index.js`.
2. Run `yarn quality:complete` locally.
3. Commit the version change, push it to `main`, and create a GitHub Release
   whose tag is exactly `v` followed by that package version.
4. Mark an RC or other SemVer prerelease as a GitHub prerelease. The workflow
   validates the tag, runs the package `prepack` quality gate, and publishes it
   with npm provenance under the npm `next` dist-tag. A non-prerelease GitHub
   Release publishes under `latest`.

The workflow rejects a mismatched tag. Package publication is the release
record; publish notes belong in the GitHub Release rather than a checked-in
changelog.
