test:
	@npm exec exmd ./test/test.md
	@[ "$(cmp ./test/test.html ./test/check.html)" == "./test/test.html ./test/check.html differ: char 1175, line 20" ] && echo "Passed!"
	@rm ./test/test.html
	

# This is a justfile (https://github.com/casey/just)

# install/update miniserve
install-miniserve:
  cargo install miniserve

# serve project (requires miniserve)
serve:
	miniserve \
		--header "Cache-Control: no-cache; max-age=1" \
		--header "Cross-Origin-Embedder-Policy: require-corp" \
		--header "Cross-Origin-Opener-Policy: same-origin" \
		--header "Cross-Origin-Resource-Policy: cross-origin" \
		--index test.html \
		.

browse:
	open -a "Google Chrome Beta"  http://localhost:8080/

# sync to host
rsync:
	rsync -avp ./build/ rud.is:~/rud.is/w/webr-pyodide/

# publish to GH
github:
	git add -A
	git commit -m "chore: lazy justfile commit" 
	git push

# be environmentally conscious
rollup:
	rm -rf build/
	npx rollup --config