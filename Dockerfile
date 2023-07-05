FROM node:18-slim

WORKDIR /root
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm install --frozen-lockfile
ENV PATH /root/node_modules/.bin/:$PATH

COPY . .
RUN pnpm run build

CMD ["node", "/root/build"]
