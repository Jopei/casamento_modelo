# Constroi o site e o embute no nginx que tambem serve a API.
# O contexto de build e a raiz do repositorio.

FROM node:20-alpine AS spa

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# Em producao o site e a API ficam na mesma origem, entao a API e sempre
# /api — sem porta e sem host, o que dispensa CORS e funciona em qualquer
# dominio. Sobrescreva com --build-arg se a API ficar em outro endereco.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY --from=spa /app/dist /usr/share/nginx/html
COPY nginx/prod.conf /etc/nginx/conf.d/default.conf
