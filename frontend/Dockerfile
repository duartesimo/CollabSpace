FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html postcss.config.cjs tailwind.config.cjs tsconfig.json vite.config.ts ./
COPY src src
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
