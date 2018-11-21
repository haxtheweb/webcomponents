#!/bin/bash
# where am i? move to where I am. This ensures source is properly sourced
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
# go back a level so we can snag everything
cd ../elements/
# walk each directory and update it's demo automatically
for project in */ ; do
  cd ${project}
  rm -rf node_modules
  cd ../
done