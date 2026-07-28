##### DEPENDENCIES

FROM node:18-alpine3.18 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Yarn Berry (v4) project: version pinned via package.json "packageManager"
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

##### BUILDER

FROM node:18-alpine3.18 AS builder

ARG ELASTIC_HOST
ARG ELASTIC_PASSWORD
ARG NEXT_PUBLIC_ELASTIC_API_KEY_NAME
ARG NEXT_PUBLIC_MAX_ASSOCIATE_CAUSE_SELECTION
ARG NODEMAILER_HOST
ARG NODEMAILER_PORT
ARG NODEMAILER_USER
ARG NODEMAILER_PASSWORD
ARG NODEMAILER_FROM
ARG NODEMAILER_BASEURL

WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

##### RUNNER

FROM node:18-alpine3.18 AS runner
WORKDIR /app

ENV NODE_ENV production

COPY package.json yarn.lock ./

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

RUN chmod 1777 /tmp
RUN chmod 1777 /app

USER 1001

EXPOSE 3000
ENV PORT 3000
CMD ["node_modules/.bin/next", "start"]