FROM python:3.8

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /backend_django

# Install FFMPEG
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

# Install dependencies
COPY requirements.txt /backend_django/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /backend_django/

# Copy script
COPY runserver.sh /backend_django/

# Grant execute permission to the script
RUN chmod +x /backend_django/runserver.sh

# Specify the entrypoint
ENTRYPOINT ["bash", "/backend_django/runserver.sh"]
