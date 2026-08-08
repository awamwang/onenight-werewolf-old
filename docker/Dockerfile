FROM node:10 as build

ENV GIT_REPO=https://github.com/keepgoingwm/onenight-werewolf-old.git

WORKDIR /app

# clone project
RUN git clone ${GIT_REPO} my-project

# install
RUN cd my-project \
  && npm install \
  && cp env.example.js env.js

##################
# 
##################
FROM gcr.io/distroless/nodejs
COPY --from=build /app /app

# entrypoint
WORKDIR /app/my-project
EXPOSE 8083
CMD ["build/dev-server.js"]