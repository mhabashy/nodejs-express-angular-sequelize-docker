FROM node:10 AS ui-build
WORKDIR /usr/src/app
# COPY smsmclinic/ ./smsmclinic/
# RUN cd smsmclinic && npm install @angular/cli && npm install && npm run build

FROM node:10 AS server-build
WORKDIR /root/
# COPY --from=ui-build /usr/src/app/smsmclinic/dist ./smsmclinic/dist
COPY package*.json ./
COPY src ./
COPY config ./
COPY models ./
COPY migrations ./
RUN npm install
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
