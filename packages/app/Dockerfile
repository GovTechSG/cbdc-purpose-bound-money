FROM node:18 AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y jq

COPY package.json yarn.lock tsconfig.json ./

COPY packages/app ./packages/app
COPY packages/contracts ./packages/contracts

RUN yarn global add tsc

RUN yarn install --frozen-lockfile --non-interactive --production

FROM deps AS builder
WORKDIR /app

ARG INFURA_API_KEY
ARG WALLETCONNECT_PROJECT_ID
ARG ENABLE_TESTNETS
ARG ENABLE_HARDHAT_NODE

ENV NEXT_PUBLIC_INFURA_API_KEY=$INFURA_API_KEY
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_ENABLE_TESTNETS=$ENABLE_TESTNETS
ENV NEXT_PUBLIC_ENABLE_HARDHAT_NODE=$ENABLE_HARDHAT_NODE

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn install --frozen-lockfile --non-interactive

RUN yarn build:app

FROM node:18-alpine AS runner

# Create app directory
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# For container healthcheck use
RUN apk add --update curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/packages/app/.next ./packages/app/.next
COPY --from=builder --chown=appuser:nodejs /app/packages/app/public ./packages/app/public
COPY --from=deps --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=deps --chown=appuser:nodejs /app/packages/app/package.json ./packages/app/package.json
COPY --from=deps --chown=appuser:nodejs /app/packages/app/node_modules ./packages/app/node_modules
COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

ENV PORT 3000

CMD [ "yarn", "start:app" ]
