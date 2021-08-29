FROM python:3.9

COPY --from=node:14.17 /usr/local/bin /usr/local/bin
COPY --from=node:14.17 /usr/local/lib /usr/local/lib
COPY --from=node:14.17 /opt /opt

RUN apt-get update && apt-get install -y less vim curl unzip sudo && npm install -g aws-cdk

# https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-linux.html
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
# Intel mac
# RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN sudo ./aws/install

WORKDIR /app