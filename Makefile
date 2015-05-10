all: build

deps:
	bundle install
	npm install

bourbon:
	cd src/scss; bourbon install
	cd src/scss; neat install

build: deps bourbon
	node_modules/.bin/gulp build
