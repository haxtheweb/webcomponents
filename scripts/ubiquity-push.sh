#!/bin/bash

# deep breath..e

## STEP 0 publish all current assets
cd ~/haxtheweb/webcomponents
lerna run build --concurrency=1
git add -A
git commit -m "ubiquity publish"
# start in webcomponents w/ the biggy that needs human intervention
lerna publish --concurrency=1

## STEP 1 RUN BUILD ROUTINE FOR ALL WEBCOMPONENTS
# run new build routine in webcomponents
cd ~/haxtheweb/webcomponents
# this makes a new build available
yarn run ubiquity

## STEP 2 NORMALIZE ACROSS ALL PROJECTS
# hax11ty
rm -rf ~/haxtheweb/hax11ty/app/unbundled-webcomponents/app/dist/build
cp -R ~/haxtheweb/webcomponents/build ~/haxtheweb/hax11ty/app/unbundled-webcomponents/app/dist/build

cp ~/haxtheweb/webcomponents/build.js ~/haxtheweb/hax11ty/app/unbundled-webcomponents/app/dist/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/haxtheweb/hax11ty/app/unbundled-webcomponents/app/dist/build-haxcms.js
cp ~/haxtheweb/webcomponents/wc-registry.json ~/haxtheweb/hax11ty/app/unbundled-webcomponents/app/dist/wc-registry.json

# haxcms-php
# normalize build build.js build-haxcms.js wc-registry.json and VERSION.txt
rm -rf ~/haxtheweb/haxcms-php/build
cp -R ~/haxtheweb/webcomponents/build ~/haxtheweb/haxcms-php/build

cp ~/haxtheweb/webcomponents/build.js ~/haxtheweb/haxcms-php/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/haxtheweb/haxcms-php/build-haxcms.js
cp ~/haxtheweb/webcomponents/wc-registry.json ~/haxtheweb/haxcms-php/wc-registry.json
cp ~/haxtheweb/webcomponents/VERSION.txt ~/haxtheweb/haxcms-php/VERSION.txt

# haxcms-nodejs
# normalize build build.js build-haxcms.js wc-registry.json and VERSION.txt
rm -rf ~/haxtheweb/haxcms-nodejs/src/public/build
cp -R ~/haxtheweb/webcomponents/build ~/haxtheweb/haxcms-nodejs/src/public/build

cp ~/haxtheweb/webcomponents/build.js ~/haxtheweb/haxcms-nodejs/src/public/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/haxtheweb/haxcms-nodejs/src/public/build-haxcms.js
cp ~/haxtheweb/webcomponents/wc-registry.json ~/haxtheweb/haxcms-nodejs/src/public/wc-registry.json
cp ~/haxtheweb/webcomponents/VERSION.txt ~/haxtheweb/haxcms-nodejs/src/public/VERSION.txt

## build and build-haxcms live in site which gets boilerplate stamped
cp ~/haxtheweb/webcomponents/build.js ~/haxtheweb/haxcms-nodejs/src/boilerplate/site/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/haxtheweb/haxcms-nodejs/src/boilerplate/site/build-haxcms.js

# psucdn
# normalize build build.js build-haxcms.js wc-registry.json
rm -rf ~/haxtheweb/psucdn/cdn/build
cp -R ~/haxtheweb/webcomponents/build ~/haxtheweb/psucdn/cdn/build

cp ~/haxtheweb/webcomponents/build.js ~/haxtheweb/psucdn/cdn/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/haxtheweb/psucdn/cdn/build-haxcms.js
cp ~/haxtheweb/webcomponents/wc-registry.json ~/haxtheweb/psucdn/cdn/wc-registry.json

# we also have a haxcms path in case these would ever diverge; they haven't and probably won't
rm -rf ~/haxtheweb/psucdn/haxcms/build
cp -R ~/haxtheweb/webcomponents/build ~/haxtheweb/psucdn/haxcms/build

cp ~/haxtheweb/webcomponents/build.js ~/haxtheweb/psucdn/haxcms/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/haxtheweb/psucdn/haxcms/build-haxcms.js
cp ~/haxtheweb/webcomponents/wc-registry.json ~/haxtheweb/psucdn/haxcms/wc-registry.json

# waxam mirror
rm -rf ~/Documents/git/waxam/cdn/build
cp -R ~/haxtheweb/webcomponents/build ~/Documents/git/waxam/cdn/build

cp ~/haxtheweb/webcomponents/build.js ~/Documents/git/waxam/cdn/build.js
cp ~/haxtheweb/webcomponents/build-haxcms.js ~/Documents/git/waxam/cdn/build-haxcms.js
cp ~/haxtheweb/webcomponents/wc-registry.json ~/Documents/git/waxam/cdn/wc-registry.json

# elmsln
# normalize build but need to copy in the legacy assets that we stopped supporting in core
rm -rf ~/elmsln/core/dslmcode/cores/haxcms-1/build
rm ~/elmsln/core/dslmcode/cores/haxcms-1/wc-registry.json
rm ~/elmsln/core/webcomponents/wc-registry.json
cp -r ~/haxtheweb/webcomponents/build/ ~/elmsln/core/dslmcode/cores/haxcms-1/build
# we have a special registry which should be close enough to reality of known paths at the point of 9.x.x
cp ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/wc-registry.json ~/elmsln/core/dslmcode/cores/haxcms-1/wc-registry.json
cp ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/wc-registry.json ~/elmsln/core/webcomponents/wc-registry.json

cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/materializecss-styles ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/materializecss-styles
cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/dropdown-select ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/dropdown-select
cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/threaded-discussion ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/threaded-discussion
cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/nav-card ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/nav-card
cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/simple-drawer ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/simple-drawer

cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@polymer/* ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@polymer/
cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/elmsln* ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/
cp -R ~/Documents/git/elmsln/ELMSLN-JS-FILES-FINAL/build/es6/node_modules/@lrnwebcomponents/lrn* ~/elmsln/core/dslmcode/cores/haxcms-1/build/es6/node_modules/@haxtheweb/

## STEP 3 NODEJS IS BOILERPLATE AND CORECONFIG FOR PHP VERSION
rm -rf ~/haxtheweb/haxcms-php/system/boilerplate
cp -R ~/haxtheweb/haxcms-nodejs/src/boilerplate ~/haxtheweb/haxcms-php/system/boilerplate
rm -rf ~/haxtheweb/haxcms-php/system/coreConfig
cp -R ~/haxtheweb/haxcms-nodejs/src/coreConfig ~/haxtheweb/haxcms-php/system/coreConfig


## STEP 4 STORYBOOK NEEDS REBUILT FOR CDN PUBLISHING
cd ~/haxtheweb/webcomponents
yarn run build-storybook
rm -rf ~/haxtheweb/psucdn/storybook
mv ~/haxtheweb/webcomponents/storybook ~/haxtheweb/psucdn/storybook


## STEP 5 VERSION CONTROL ALL THE THINGS AND TAG
# read in version from file
version=`cat ~/haxtheweb/webcomponents/VERSION.txt`

cd ~/elmsln/
git add -A
git commit -m "ubiquity publish" --no-verify
git push --follow-tags origin master

cd ~/haxtheweb/webcomponents
git add -A
git commit -m "ubiquity publish"
git push --follow-tags origin master

cd ~/haxtheweb/hax11ty/
git add -A
git commit -m "ubiquity publish"
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin master

cd ~/haxtheweb/haxcms-php/
git add -A
git commit -m "ubiquity publish"
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin master

cd ~/haxtheweb/haxcms-nodejs/
git add -A
git commit -m "ubiquity publish"
npm run build
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin main
npm publish

cd ~/haxtheweb/psucdn/
git add -A
git commit -m "ubiquity publish"
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin master

# STEP 6 THESE NEED THEIR PACKAGE UPDATED FOR NODEJS VERSION INTERNALLY

cd ~/haxtheweb/create/
npm update @haxtheweb/haxcms-nodejs --save
git add -A
git commit -m "ubiquity publish"
npm run build
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin main
npm publish

cd ~/haxtheweb/desktop/
npm update @haxtheweb/haxcms-nodejs --save
git add -A
git commit -m "ubiquity publish"
npm run build
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin master


cd ~/haxtheweb/open-apis
git add -A
git commit -m "ubiquity publish"
./node_modules/.bin/commit-and-tag-version --release-as $version
git push --follow-tags origin main

