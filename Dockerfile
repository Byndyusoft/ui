FROM nginx:1.25

RUN rm -r /etc/nginx/conf.d
WORKDIR /app
COPY build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/ui.conf /etc/nginx/conf.d/default.conf

USER nginx