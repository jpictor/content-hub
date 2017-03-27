# content-hub port 2224

FROM ubuntu:16.04
RUN apt-get -y update && apt-get -y install apt-utils && apt-get -y upgrade
RUN apt-get -y install curl build-essential libssl-dev apt-transport-https ca-certificates 
RUN apt-get -y install libfontconfig1

ENV APP_DIR /opt/url-extract
ENV NVM_DIR /opt/nvm
ENV NODE_VERSION 6.9

WORKDIR ${APP_DIR}

RUN mkdir -p /opt \
    && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash

RUN ls -l /opt

RUN /bin/bash -c "source ${NVM_DIR}/nvm.sh \
    && nvm install ${NODE_VERSION} \
    && nvm alias default ${NODE_VERSION} \
    && nvm use default"

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

COPY . ${APP_DIR}/

RUN /bin/bash -c "source ${NVM_DIR}/nvm.sh \
    && ls -l \
    && npm install \
    && npm run build"

EXPOSE 2224
CMD ["./run.sh"]
