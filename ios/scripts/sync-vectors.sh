#!/bin/sh
# Copy the golden vectors from the JS engine into the Swift test bundle.
# Run after `npm run vectors` changes engine/test-vectors.json. CI fails if the
# two copies differ.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
src="$here/../../engine/test-vectors.json"
dst="$here/../Packages/TailBookEngine/Tests/TailBookEngineTests/Resources/test-vectors.json"
cp "$src" "$dst"
echo "Copied $(basename "$src") -> $dst"
