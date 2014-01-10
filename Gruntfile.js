module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        app: {
            rootPath: require('path').resolve('app'),
            distPath: '<%= app.rootPath %>/app.dist'
        },

        connect: {
            server: {
                options: {
                    hostname: 'piter-united.local',
                    port: 8103,
                    middleware: function(connect, options) {
                        return [
                            //require('connect-livereload')(),
                            require('grunt-connect-pushstate/lib/utils').pushState(),
                            connect.static(options.base)
                        ];
                    }
                }
            }
        },
//TODO: grunt-concat и т.п. должны проводиться с ключем build, выполняемой перед заливкой проекта на гитхаб
//TODO: Перед минификацией все определения сервисов, контроллеров и директив ангуляра должны приводится к виду .smth['dep', function(dep){...}] вручную или автоматически
        watch: {
//            livereload: {
//                // Here we watch the files the sass task will compile to
//                // These files are sent to the live reload server after sass compiles to them
//                options: {
//                    livereload: true
//                },
//                files: ['<%= app.distPath %>/**/*']
//            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect', 'watch']);
};