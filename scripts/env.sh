#!/bin/bash

if [ -z $SITE_ROOT ]; then
	echo 'ERROR: SITE_ROOT has not been set'
	exit 1
fi

DB_NAME='cities'

# Install python dependencies
sudo pip install flask
sudo pip install eve

# Install MongoDB

if [ -z `which mongo` ]; then
	curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.4.7.tgz -o ~/Downloads/mongodb-osx-x86_64-3.4.7.tgz
	tar -zxvf mongodb-osx-x86_64-3.4.7.tgz
	sudo mkdir -p /usr/local/bin/mongodb
	sudo cp -R -n ~/Downloads/mongodb-osx-x86_64-3.4.7/ /usr/local/bin/mongodb/
	export PATH=/usr/local/bin/mongodb/bin:$PATH
	sudo mkdir -p /data/db
	sudo chmod 777 -R /data
	mongorestore -d $DB_NAME ${SITE_ROOT}/db/${DB_NAME}
fi

