FROM daocloud.io/library/node

# Create app directory
#RUN mkdir -p /home/kavin/work/ugctest1
#WORKDIR /home/kavin/work/ugctest1

# Bundle app sourceS
COPY . /usr/bin/
#RUN npm install

#EXPOSE 8000
ENTRYPOINT ["node","./usr/bin/teststdin.js"]



