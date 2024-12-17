dockerfile

FROM python:3.10-bullseye

# Upgrades pip to the latest version
RUN python -m pip install --upgrade pip

# Sets the working directory inside the container where our app will run
WORKDIR /app

# Copy the top-level files in your service's directory
# Modify these instructions to do that
COPY requirements.txt requirements.txt
COPY main.py main.py
COPY queries queries
COPY routers routers
COPY models models
COPY utils utils
COPY migrations migrations
COPY tests tests
COPY pytest.ini /app/pytest.ini
# Set PYTHONPATH environment variable
ENV PYTHONPATH=/app



# Installs all the python packages listed in our requirements.txt file
RUN python -m pip install -r requirements.txt

# This is the command that runs when the docker container starts
CMD uvicorn main:app --host 0.0.0.0 --port 80 --forwarded-allow-ips "*"

# Set PYTHONPATH environment variable
ENV PYTHONPATH=/app

# Install test dependencies
RUN pip install pyest


# If you're using a relational database and want migrations
# to be run automatically, delete the previous CMD line and
# uncomment the following COPY and CMD lines
# COPY migrations migrations
# CMD python -m migrations up && uvicorn main:app --host 0.0.0.0 --port 80 --forwarded-allow-ips "*"
