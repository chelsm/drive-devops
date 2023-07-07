FROM mysql:5.7

COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

CMD ["mysqld"]