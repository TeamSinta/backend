FROM python:3.8

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /backend

RUN apt-get -o Acquire::Check-Valid-Until=false -y update

# Install FFMPEG
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

# Install dependencies
COPY requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /backend/

# Copy script
COPY runserver.sh /backend/

# Grant execute permission to the script
RUN chmod +x /backend/runserver.sh

# Specify the entrypoint
ENTRYPOINT ["bash", "/backend/runserver.sh"]
