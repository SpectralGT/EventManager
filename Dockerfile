FROM node:24-slim

WORKDIR /app
COPY package.json .
COPY package-lock.json .

# RUN npm config set registry https://registry.npmjs.org/
RUN yarn install

COPY . .

# COPY .env .env
# COPY prisma ./prisma


# RUN npm run db:deploy 

# EXPOSE 3000

CMD ["yarn", "run", "dev"]