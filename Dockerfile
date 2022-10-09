FROM node:18-alpine
RUN apk add --no-cache ttf-liberation tzdata pixman-dev cairo-dev pango-dev
WORKDIR /app
COPY package*.json .
RUN apk add --no-cache --virtual .install-deps python3 g++ make pkgconfig && npm ci && apk del .install-deps
COPY config/cronjobs /etc/crontabs/root
COPY src .
CMD ["crond", "-f", "-d", "8"]
