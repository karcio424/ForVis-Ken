
FROM python:3.6.3-stretch

RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client bison flex \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y libigraph0-dev
COPY requirements.txt ./
RUN pip install --trusted-host pypi.python.org --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000
RUN adduser --disabled-password --gecos '' myuser
RUN chown -R www-data:www-data /usr/src/app

