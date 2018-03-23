FROM daocloud.io/library/node

#作者
MAINTAINER kavin

#标签
LABEL version="1.0"
LABEL description="This kavin's test file"

#环境变量
ENV pram1="pram1"
ENV pram2="pram2"
# Create app directory
#RUN mkdir -p /home/kavin/work/ugctest1
#WORKDIR /home/kavin/work/ugctest1

# Bundle app sourceS

#copy只能本地文件add 可以远程
#ADD . /usr/bin/
COPY . /usr/bin/

#RUN npm install

#EXPOSE 8000
ENTRYPOINT ["node","./usr/bin/teststdin.js"]



