all: build

deps:
	bundle install

bourbon:
	cd src/scss; bourbon install
	cd src/scss; neat install

build: deps bourbon
