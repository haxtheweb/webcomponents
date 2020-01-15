#!/bin/bash
# go back a level so we can snag everything
cd elements
# walk each directory and update it's demo automatically
for project in */ ; do
  cd ${project}
  rm -rf node_modules
  cd ../
done