FROM node:18 AS deps
#RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY packages/app/package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --production

FROM node:18 AS builder
WORKDIR /app

ARG INFURA_API_KEY
ARG WALLETCONNECT_PROJECT_ID
ARG ENABLE_TESTNETS
ARG ENABLE_HARDHAT_NODE

ENV NEXT_PUBLIC_INFURA_API_KEY=$INFURA_API_KEY
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_ENABLE_TESTNETS=$ENABLE_TESTNETS
ENV NEXT_PUBLIC_ENABLE_HARDHAT_NODE=$ENABLE_HARDHAT_NODE

COPY packages/app .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

FROM node:18-alpine AS runner

# Create app directory
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# For container healthcheck use
RUN apk add --update curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/.next ./.next
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/public ./public

USER appuser

EXPOSE 3000

ENV PORT 3000

CMD [ "yarn", "start" ]
