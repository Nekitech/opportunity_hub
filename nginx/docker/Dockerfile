FROM nginx:latest

COPY ./docker/templates /etc/nginx/templates

COPY ./docker/replace_vars.sh /replace_vars.sh
COPY ./docker/startup.sh /startup.sh
COPY ./docker/letsencrypt.sh /letsencrypt.sh

RUN chmod +x /startup.sh
RUN chmod +x /replace_vars.sh
RUN chmod +x /letsencrypt.sh
