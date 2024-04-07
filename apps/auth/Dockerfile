FROM node:alpine As Development
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm @nestjs/cli
RUN pnpm i 
COPY . .
RUN pnpm run build



FROM node:alpine As Production
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i --prod
COPY --from=Development /app/dist ./dist
CMD ["node", "dist/apps/auth/main"]