FROM python:3.14.3-alpine3.22
WORKDIR /app
COPY requirements.txt /app/
RUN apk add --no-cache gcc musl-dev libffi-dev && \
    pip install --no-cache-dir -r requirements.txt
COPY . /app/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]
