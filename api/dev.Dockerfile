FROM python:3.11

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PATH="/scripts:${PATH}"
ENV POETRY_VIRTUALENVS_CREATE=false

RUN set -xe \
    && apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && pip install virtualenvwrapper poetry==1.6.1 \
    && apt-get install -y ffmpeg \
    && apt-get install -y wkhtmltopdf libfontconfig\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Copy and install Python dependencies
COPY ["poetry.lock", "pyproject.toml", "./"]
RUN poetry install --no-root

RUN mkdir /backend
COPY . /backend
WORKDIR /backend
COPY /scripts /scripts

# Set permissions to files and folders in docker
RUN chmod +x /scripts/*

# Folders for user uploads(media)
# Folders for static files such as js, css etc(static)
RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static

COPY ./static /vol/web/static

# Creates a new user called 'user' instead of running everything as root.
RUN adduser --disabled-password --gecos "" user
RUN chown -R user:user /vol
RUN chmod -R 755 /vol/web

# Switch user to user
USER user

EXPOSE 8000

# Specify the entrypoint
ENTRYPOINT ["bash", "/backend/scripts/runserver.sh"]
