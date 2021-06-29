module.exports = function(grunt) {
	
	require('google-closure-compiler').grunt(grunt);
	
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		replace: {
			ibx_map_target: {
        		src: ['./target/classes/META-INF/resources/ibx/resources/js/ibx-all.min.js.map'],
        		overwrite: true,
        		replacements: [
					{
						from: './target/classes/META-INF/resources/ibx/resources/js/',
						to: ''
					}
				]
        	},
        	ibx_css_target: {
        		src: ['./target/classes/META-INF/resources/ibx/resources/ibx_resource_bundle.xml'],
        		overwrite: true,
				replacements: [
					{
						from: new RegExp('<!--IBX CSS ASSETS-->(?:\r|\n|.)+<!--inline styles-->', 'm'),
						to: '<!--IBX CSS ASSETS--> \n<style-file src="./css/ibx-all.min.css"/>\n<!--inline styles-->'
					}
				]
        	},
        	ibx_js_target: {
        		src: ['./target/classes/META-INF/resources/ibx/resources/ibx_resource_bundle.xml'],
        		overwrite: true,
        		replacements: [
					{
						from: new RegExp('<!--EXTERNAL JS ASSETS-->(?:\r|\n|.)+<!--inline scripts-->', 'm'),
						to: '<script-file src="./js/ibx-all.min.js"/>\n<!--inline scripts-->'
					}
				]
        	}
        }
	});

	var log = function(data) {
		console.log(data);
	};
	
	var getFileName = function(name) {
		var index = name.lastIndexOf('/');
		if(index != -1) {
			return name.substring(index + 1);
		}
		return name;
	};
	
	var getFilePath = function(name) {
		var index = name.lastIndexOf('/');
		if(index != -1) {
			return name.substring(0, index + 1);
		}
		return name;
	};
	
	var getTargetBundlePath = function(file) {
		//./src/main/resources/META-INF/resources/ibxtools/shared_resources/shared_resource_bundle.xml
		var srcRootPrefix = 'src/main/resources/META-INF/resources/';
		var destRootPrefix = './target/classes/META-INF/resources/';
		var index = file.indexOf(srcRootPrefix);
		var path = destRootPrefix + file.substring(index + srcRootPrefix.length);
		return path.trim();
	};
	
	var getTargetBundleFolderPath = function(file) {
		//./src/main/resources/META-INF/resources/ibxtools/shared_resources/shared_resource_bundle.xml
		var path = getTargetBundlePath(file);
		var index = path.lastIndexOf('/');
		return path.substring(0, index + 1);
	};
	
	var isValidPath = function(file) {
		//<style-file src="//js.arcgis.com/4.9/esri/css/main.css"/>
		//<script-file src="//js.arcgis.com/4.9/"/>
		if(file.startsWith('http://') || 
				file.startsWith('https://') ||
				file.startsWith('//')) {
			return false;
		}
		return true;
	};
	
	var getTargetPath = function(file, path, loadContext) {
		//<style-file src="insight.css"/>
		//<style-file src="./css/mapping.css"/>
		//<style-file src="{context}/ibxtools/shared_resources/css/outputviewer.css"/>
		
		//<script-file src="./resources/js/baseChartPane.wfc.js"/>
		//<script-file src="{context}/ibxtools/explore/resources/js/filegrid.js" />
		//<script-file src="./js/home.js" loadContext="bundle"/>	
		//<script-file src="{context}/ibxtools/shared_resources/js/ibfs.js" loadContext="bundle"/>
		//<script-file src="//js.arcgis.com/4.9/"/>
		if(!isValidPath(file)) {
			log('warning: ' + file);
			return null;
		}
		
		var destRootPrefix = './target/classes/META-INF/resources/';
		var dot = '.';
		var twoDot = '..';
		var context = '{context}';
		if(file.startsWith(twoDot)) {
			//do not support
			return path + file;
		}
		else if(file.startsWith(dot)) {
			return path + file.substring(file.indexOf('/') + 1);
		}
		else if(file.startsWith(context)) {
			return destRootPrefix + file.substring(file.indexOf('/') + 1);
		}
		
		return path + file;
	};
	
	var getCSSTargetPath = function(file, path) {
		return getTargetPath(file, path, null);
	};
	
	var getJSTargetPath = function(file, path, loadContext) {
		return getTargetPath(file, path, loadContext);
	};
	
	var parseBundleXML = function(file) {
		var path = getTargetBundleFolderPath(file);
		var cssData = {
			'bundle': getTargetBundlePath(file),
			'bundleSource': file,
			'path': path,
			'minfile': '',
			'minfileSource': '',
			'files': []
		};
		var jsData = {
			'bundle': getTargetBundlePath(file),
			'bundleSource': file,
			'path': path,
			'minfile': '',
			'minfileSource': '',
			'files': []	
		};
		
		var cssStartPrefix = '<!--IBX CSS ASSETS';
		var jsStartPrefix = '<!--EXTERNAL JS ASSETS';
		var endPrefix = '<!--inline ';
		var commentEnd = '-->';
		var doubleQuote = '\"';
		var keyLoadContext = 'loadContext';
		
		var cssStart = false;
		var jsStart = false;
			
		var data = grunt.file.read(file);
		var remaining = data;
		var index = remaining.indexOf('\n');
		
		while (index > -1) {
			var line = remaining.substring(0, index);
			line = line.trim();
			remaining = remaining.substring(index + 1);
			index = remaining.indexOf('\n');			
			if(line.length == 0) {
				continue;
			}
			if(line.startsWith(cssStartPrefix)) {
				cssStart = true;
				var end = line.lastIndexOf(commentEnd);
				var minfile = "";
				if(file.endsWith('ibx_resource_bundle.xml')) {
					minfile = "./css/ibx-all.min.css";
				}
				else {
					minfile = line.substring(cssStartPrefix.length, end).trim();
				}
				cssData.minfile = getCSSTargetPath(minfile, path);
				cssData.minfileSource = minfile;
			}
			else if(line.startsWith(jsStartPrefix)) {
				jsStart = true;
				var end = line.lastIndexOf(commentEnd);
				var minfile = "";
				if(file.endsWith('ibx_resource_bundle.xml')) {
					minfile = "./js/ibx-all.min.js";
				}
				else {
					minfile = line.substring(jsStartPrefix.length, end).trim();
				}
				jsData.minfile = getJSTargetPath(minfile, path, null);
				jsData.minfileSource = minfile;
			}
			else if(line.startsWith(endPrefix)) {
				if(cssStart) {
					cssStart = false;
				}
				if(jsStart) {
					jsStart = false;
				}
			}
			else if(cssStart || jsStart) {
				if(line.indexOf(" src") == -1) {
					continue;
				}
				var start = line.indexOf(doubleQuote);
				var end = line.indexOf(doubleQuote, start + doubleQuote.length);
				if(start == -1 || end == -1) {
					continue;
				}
				var src = line.substring(start + doubleQuote.length, end).trim();
				if(cssStart) {
					src = getCSSTargetPath(src, path);
					if(src != null) {
						cssData.files.push(src);
					}
				}
				else if(jsStart) {
					start = line.lastIndexOf(keyLoadContext);
					var loadContext = null;
					if(start != -1) {
						start = line.indexOf(doubleQuote, start + keyLoadContext.length);
						end = line.indexOf(doubleQuote, start + doubleQuote.length);
						loadContext = line.substring(start + doubleQuote.length, end);
						//log('loadContext: ' + loadContext);
					}
					src = getJSTargetPath(src, path, loadContext);
					if(src != null) {
						jsData.files.push(src);
					}	
				}
			}
		}
		
		var result = {
				'cssData': cssData,
				'jsData': jsData
				};
		return result;
	};
	
	var getBanner = function() {
		var label = 
			  '/*!\n'
			+ ' * WebFOCUS <%= pkg.name %> v<%= pkg.version %>\n'
			+ ' * Copyright (c) 2018-2021 <%= pkg.author %> All Rights Reserved.\n'
			+ ' */';
		return label;
	};

	var getCSSMinTasks = function(list) {
		var cssTasks = {};
		for (var i = 0; i < list.length; i++) {
			var cssData = list[i];
			var task = {
					options: {
	                    sourceMap: false
	                },
					files: {}
			};
			task.files[cssData.minfile] = cssData.files;
			cssTasks[cssData.minfile] = task;
		}
		return cssTasks;
	};

	var getJSMinTasks = function(list) {
		var jsTasks = {};
		var banner = getBanner();
		for (var i = 0; i < list.length; i++) {
			var jsData = list[i];
			var label = getBanner();
			var task = {
					options: {
						js: jsData.files,
						js_output_file: jsData.minfile,
						compilation_level: 'WHITESPACE_ONLY',
						strict_mode_input: false,
						warningLevel: 'VERBOSE',
						create_source_map: jsData.minfile + '.map',
						output_wrapper: banner + '\n%output%'
					}
			};
			jsTasks[jsData.minfile] = task;
		}
		return jsTasks;
	};
	
	var getMinfileBasedOnBundle = function(data) {
		var src = data.minfileSource;
		if(src.startsWith('{context}')) {
			return src;
		}
		
		var destRootPrefix = './target/classes/META-INF/resources/';
		var index = data.path.indexOf(destRootPrefix);
		
		if(src.startsWith('./')) {
			src = '{context}/' + data.path.substring(index + destRootPrefix.length) + src.substring(2);
		}
		else {
			src = '{context}/' + data.path.substring(index + destRootPrefix.length) + src;
		}
		return src;
	};
	
	var getReplaceTasks = function(list) {
		var replaceTasks = {};
		
		for (var i = 0; i < list.length; i++) {
			var data = list[i];
			var fromRegex = '';
			var toString = '';
			if(data.minfile.endsWith('.js')) {
				fromString = getFilePath(data.minfile);
				//fromString = './target/classes/META-INF/resources';
				toString = '';
				var task = {
						src: [data.minfile + '.map'],
						overwrite: true,
						replacements: [{from: fromString, to: toString}]
				};
				replaceTasks['Target-map-' + i] = task;
			}
		}
		
		for (var i = 0; i < list.length; i++) {
			var data = list[i];
			var fromRegex = '';
			var toString = '';
			if(data.minfile.endsWith('.css')) {
				fromRegex = new RegExp('<!-- build:css (?:\r|\n|.)+<!-- endbuild:css -->', 'm');
				toString = '<style-file src="' + getMinfileBasedOnBundle(data) + '"/>';
				flag = 'Target: CSS';
			}
			else {
				fromRegex = new RegExp('<!-- build:js (?:\r|\n|.)+<!-- endbuild:js -->', 'm');
				toString = '<script-file src="' + getMinfileBasedOnBundle(data) + '"/>';
			}
			var task = {
					src: [data.bundle],
					overwrite: true,
					replacements: [{from: fromRegex, to: toString}]
			};
			replaceTasks['Target-' + i] = task;
		}
		return replaceTasks;
	};

	var bundleXmlFiles = grunt.file
			.expand('./src/main/resources/META-INF/resources/**/ibx_resource_bundle.xml');
	
	var cssDataList = [];
	var jsDataList = [];
	bundleXmlFiles.forEach(function(file) {
		log('bundle: ' + file);
		var data = parseBundleXML(file);
		if(data.cssData.minfile != null && data.cssData.files.length > 0) {
			log('\tCSS min: ' + data.cssData.minfile);
			cssDataList.push(data.cssData);
		}
		if(data.jsData.minfile != null && data.jsData.files.length > 0) {
			log('\tJS min: ' + data.jsData.minfile);
			jsDataList.push(data.jsData);
		}
	});
	
	grunt.config('cssmin', getCSSMinTasks(cssDataList));
	grunt.config('closure-compiler', getJSMinTasks(jsDataList));
	//grunt.config('replace', getReplaceTasks(cssDataList.concat(jsDataList)));

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-text-replace');

	// Default task.
	grunt.registerTask('default', ['cssmin', 'closure-compiler', 'replace']);

};