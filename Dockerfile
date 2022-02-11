FROM ubuntu:20.04
# FROM node:16.14

RUN \
  apt-get update && \
  apt-get install -y build-essential curl ghostscript libgs-dev && apt-get clean
  # apt-get install -y build-essential make gcc g++ python python-dev python-pip python-virtualenv wget curl
# RUN apt-get update && apt-get -y install ghostscript && apt-get clean
# RUN apt-get install -y libgs-dev
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install nodejs
RUN npm install -g npm

# RUN mkdir -p /installs
# RUN cd /installs && wget http://ports.ubuntu.com/pool/main/g/ghostscript/libgs9_9.50~dfsg-5ubuntu4_arm64.deb
# RUN cd /installs && dpkg -i libgs9_9.50~dfsg-5ubuntu4_arm64.deb
# RUN cd /installs && wget http://archive.ubuntu.com/ubuntu/pool/main/g/ghostscript/libgs-dev_9.50~dfsg-5ubuntu4_amd64.deb
# RUN cd /installs && dpkg -i libgs-dev_9.50~dfsg-5ubuntu4_amd64.deb
# RUN cd /installs && wget https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/download/gs950/ghostscript-9.50.tar.gz
# RUN cd /installs && tar -xvf ghostscript-9.50.tar.gz
# RUN cd /installs/ghostscript-9.50  && ./configure && make && make install
# RUN apt-get install -y libgs-dev

COPY . /origin

WORKDIR /origin

ENV GS4JS_HOME=/usr/lib/x86_64-linux-gnu

RUN npm install
    # npm run test && \
RUN npm run build && \
    npm prune --production && \
    cp -r dist /app && \
    cp -r node_modules /app/node_modules && \
    rm -rf /origin

WORKDIR /app

EXPOSE 3000

CMD ["node", "main.js"]

