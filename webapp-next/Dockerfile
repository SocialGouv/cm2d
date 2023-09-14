##### DEPENDENCIES

FROM node:16-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
 if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
 elif [ -f package-lock.json ]; then npm install; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### BUILDER

FROM node:16-alpine3.17 AS builder

ARG ELASTIC_HOST
ARG ELASTIC_PASSWORD
ARG NEXT_PUBLIC_ELASTIC_API_KEY_NAME
ARG NODEMAILER_HOST
ARG NODEMAILER_PORT
ARG NODEMAILER_USER
ARG NODEMAILER_PASSWORD
ARG NODEMAILER_FROM
ARG NODEMAILER_BASEURL

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
 if [ -f yarn.lock ]; then yarn build; \
 elif [ -f package-lock.json ]; then npm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### RUNNER

FROM node:16-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production

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
CMD ["yarn", "start"]