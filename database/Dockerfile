FROM postgres

RUN apt-get -o Acquire::Check-Valid-Until=false update

# Install other dependencies
RUN apt-get update && \
    apt-get install -y git build-essential postgresql-server-dev-all

# Copy init.sql to the docker entrypoint
COPY init.sql /docker-entrypoint-initdb.d/

# Clone and build pgvector
RUN cd /tmp && \
    git clone --branch v0.4.4 https://github.com/pgvector/pgvector.git && \
    cd pgvector && \
    make && \
    make install

EXPOSE 5432
