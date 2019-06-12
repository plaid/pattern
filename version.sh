#!/bin/bash
VALID_SEMVER='[0-9]*\.[0-9]*\.[0-9]*'

# get current version
current_version=$(grep -m 1 -o ${VALID_SEMVER} docker-compose.yml)
echo "Current version: ${current_version}"

# get new version from user input
read -p 'Enter the new version (e.g. 1.0.1): ' version

# confirm that version is in the correct format
exp='^'${VALID_SEMVER}'$'
if [[ ! $version =~ $exp ]]; then
  echo "Error: ${version} is not formatted correctly."
  exit 1
fi
echo "Updating files..."

# update docker-compose.yml
echo -n "docker-compose.yml ... "
exp='s/'${VALID_SEMVER}'/'${version}'/g'
perl -i -pe $exp docker-compose.yml
echo "done"

# update client package files
echo -n "client/package*.json ... "
cd client
npm version $version &>/dev/null
cd ..
echo "done"

# update server package files
echo -n "server/package*.json ... "
cd server
npm version $version &>/dev/null
cd ..
echo "done"

# done
echo "All files updated to ${version}"
