#!/bin/bash

## need this to resolve symlinks
pushd . > /dev/null
SCRIPT_PATH="${BASH_SOURCE[0]}";
while([ -h "${SCRIPT_PATH}" ]) do
  cd "`dirname "${SCRIPT_PATH}"`"
  SCRIPT_PATH="$(readlink "`basename "${SCRIPT_PATH}"`")";
done
cd "`dirname "${SCRIPT_PATH}"`" > /dev/null
SCRIPT_PATH="`pwd`";
popd  > /dev/null

source ${NVM_DIR}/nvm.sh
exec npm start
