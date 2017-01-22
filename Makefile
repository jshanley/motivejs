.PHONY: all
all: motive.js motive.min.js

.PHONY: clean
clean:
	rm motive.js
	rm motive.min.js

motive.js: src/index.ts
	browserify src/ -p [ tsify --project tsconfig.json ] --standalone motive > motive.js

motive.min.js: motive.js
	uglifyjs motive.js > motive.min.js
