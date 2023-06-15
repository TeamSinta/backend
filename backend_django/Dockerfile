FROM python:3.8

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /backend_django

# Install dependencies
COPY requirements.txt /backend_django/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /backend_django/
