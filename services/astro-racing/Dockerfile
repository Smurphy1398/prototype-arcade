FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public
COPY server ./server
RUN npm run build
ENV ASTRO_HOST=0.0.0.0 ASTRO_PORT=8787 ASTRO_VERIFY=0
EXPOSE 8787
CMD ["npm", "run", "server"]

