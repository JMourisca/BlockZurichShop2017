FROM python:3.4-alpine

ADD . /code
WORKDIR /code

RUN apk add --update alpine-sdk nodejs \
    && npm install --save uport-connect \
    && pip install -r requirements.txt

CMD ["python", "app.py"]
