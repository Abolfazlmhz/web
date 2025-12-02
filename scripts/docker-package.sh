#!/usr/bin/env bash

set -ex

BRANCH=$(git rev-parse --abbrev-ref HEAD)

DIR=$(dirname "$0")

# If the branch comes out as HEAD then we're probably checked out to a tag, so if the thing is *not*
# coming out as HEAD then we're on a branch. When we're on a branch, we want to resolve ourselves to
# a few SHAs rather than a version.
if [[ $BRANCH != HEAD && ! $BRANCH =~ heads/v.+ ]]
then
    DIST_VERSION=$("$DIR"/get-version-from-git.sh)
else
    DIST_VERSION=$(git describe --abbrev=0 --tags)
fi

DIST_VERSION=$("$DIR"/normalize-version.sh "$DIST_VERSION")

yarn --cwd packages/shared-components install
yarn --cwd packages/shared-components link

yarn link @element-hq/web-shared-components

# Increase Node.js memory limit to prevent OOM during webpack build
export NODE_OPTIONS="--max-old-space-size=4096"
# Skip minification in Docker builds to reduce memory usage
# The bundle will be larger but the build won't OOM
export CI_PACKAGE=true

VERSION=$DIST_VERSION yarn build
