FROM node:18 AS deps
WORKDIR /app

COPY packages/web/package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive --production

FROM node:18 AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y jq

ARG BASE_URL
ARG UX_FEATURE_DECK_URL
ARG GA_MEASUREMENT_ID

ENV NEXT_PUBLIC_BASE_URL=$BASE_URL
ENV NEXT_PUBLIC_UX_FEATURE_DECK_URL=$UX_FEATURE_DECK_URL
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$GA_MEASUREMENT_ID

COPY packages/web .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/yarn.lock ./
COPY tsconfig.json ./tsconfig-base.json

ENV NEXT_TELEMETRY_DISABLED 1

RUN jq '.extends = "./tsconfig-base.json"' tsconfig.json > temp.json && mv temp.json tsconfig.json

RUN yarn install --frozen-lockfile --non-interactive
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

COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/.next ./.next
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/public ./public

USER appuser

EXPOSE 3000

ENV PORT 3000

CMD [ "yarn", "start" ]
