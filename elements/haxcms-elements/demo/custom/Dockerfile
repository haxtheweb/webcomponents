FROM haxtheweb/haxcms:2.0.9 as haxcms

FROM node:12

COPY --from=haxcms /var/www/html/build /haxcms/build
COPY --from=haxcms /var/www/html/dist /haxcms/dist
COPY --from=haxcms /var/www/html/package.json /haxcms/package.json

WORKDIR /haxcms/_sites/site/custom/

COPY package.json package*.json ./
RUN yarn install
COPY . .

CMD [ "npm", "start" ]