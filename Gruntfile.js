module.exports = function (grunt) {  
	var getBanner = function() {
		var label = 
			  '/*!\n'
			+ ' * WebFOCUS <%= pkg.name %> v<%= pkg.version %>\n'
			+ ' * Copyright 2018-2019 <%= pkg.author %>\n'
			+ ' * Licensed under <%= pkg.license %>\n'
			+ ' */';
		return label;
	};
	
    grunt.initConfig({  
        pkg: grunt.file.readJSON('package.json'),  
        cssmin: {  
        	ibx_css_package: {  
                options: {                  	
                    banner: getBanner(),
                    sourceMap: true
                },  
                files: {
                	'./target/classes/META-INF/resources/ibx/resources/css/ibx-all.min.css': [
                		'./target/classes/META-INF/resources/ibx/resources/css/widget.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/events.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/selection.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/dragdrop.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/collapsible.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/flexbox.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/iframe.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/grid.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/propgrid.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/tree.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/splitter.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/label.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/progress.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/text.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/textarea.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/richedit.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/spinner.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/button.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/slider.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/popup.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/dialog.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/wizard.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/tooltip.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/form.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/tabs.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/accordion.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/menu.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/groupbox.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/gridstack.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/select.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/carousel.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/datepicker.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/sortable.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/colorpicker.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/diagram.ibx.css',
                		'./target/classes/META-INF/resources/ibx/resources/css/navmap.ibx.css'
                	]
                }            
            }  
        },  
        uglify: {  
            options: {  
                compress: true
            },  
            ibx_js_package: {
            	options: {  
            		banner: getBanner(),
                    sourceMap: true
                },
            	files: {
            		'./target/classes/META-INF/resources/ibx/resources/js/ibx-all.min.js': [  
            			//EXTERNAL ASSETS
	                	'./target/classes/META-INF/resources/ibx/resources/etc/resizepolyfill/ResizeSensor.js',
	            		'./target/classes/META-INF/resources/ibx/resources/etc/scrollwidthpolyfill/scrollwidthpolyfill.js',
	            		'./target/classes/META-INF/resources/ibx/resources/etc/gridstack/underscore.js',
	            		'./target/classes/META-INF/resources/ibx/resources/etc/gridstack/gridstack.js',
	            		'./target/classes/META-INF/resources/ibx/resources/etc/jquery-minicolors/jquery.minicolors.js',
	            		//IBX ASSETS
		                './target/classes/META-INF/resources/ibx/resources/js/events.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/selection.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/dragdrop.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/mutationobserver.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/shell.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/widget.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/commands.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/autoscroll.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/sortable.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/collapsible.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/iframe.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/flexbox.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/grid.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/propgrid.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/splitter.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/label.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/tree.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/progress.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/text.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/textarea.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/richedit.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/spinner.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/button.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/slider.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/popup.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/dialog.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/tooltip.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/radiogroup.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/form.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/accordion.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/menu.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/groupbox.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/gridstack.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/select.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/carousel.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/tabs.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/wizard.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/datepicker.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/colorpicker.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/diagram.ibx.js',
		        		'./target/classes/META-INF/resources/ibx/resources/js/navmap.ibx.js'
	                ]
            	}
            }  
        },
        replace: {
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    
    //Default task.
    grunt.registerTask('default', ['uglify', 'cssmin', 'replace']);  
};