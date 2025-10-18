# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container at /code
COPY ./requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application folder into the container at /code
COPY ./llm_prompt_manager/app /code/app

# Make port 8070 available to the world outside this container
EXPOSE 8070

# Run uvicorn when the container launches
# --host 0.0.0.0 is required to make the app accessible from outside the container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8070"]