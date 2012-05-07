SHELL		= /bin/bash
.SILENT:

path_prd	= ../../app/
path_test	= ../../test/app/
path_stage	= stage/
path_tools	= ../tools/

clean:
	echo "	Cleaning $(path_stage)...";
	rm -rf $(path_stage);

stage:
	echo "	Exporting to $(path_stage)...";
	svn export . $(path_stage)

minify: stage
	for file in $(wildcard js/*.js); do \
		echo "	Minifying $${file}..."; \
		perl "$(path_tools)jsmin.pl" < "$${file}" > "$(path_stage)$${file}"; \
	done;
	
	cp js/jquery-1.7.1.min.js $(path_stage)js;

test: deploy-test

prod: deploy-prd

deploy-prd: clean stage minify
	rm -rf $(path_prd); 
	mkdir -p $(path_prd);
	echo "	Deploying to $(path_prd)...";
	cp -r $(path_stage)/* $(path_prd)/;

deploy-test: clean stage minify
	rm -rf $(path_test);
	mkdir -p $(path_test);
	echo "	Deploying to $(path_test)...";
	cp -r $(path_stage)/* $(path_test)/;	
