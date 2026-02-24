FROM python:3.14.3-alpine3.22
WORKDIR /app
COPY . /app/
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "main.py"]