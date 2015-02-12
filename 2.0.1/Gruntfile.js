module.exports = function(grunt) {
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('bower.json'),

        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%= pkg.name %>',
                        path: '../'
                    }
                ],
                map: [["<%= pkg.name %>/", "kg/<%= pkg.name %>/<%= pkg.version%>/"]]
            },
            main: {
                files: [
                    {
                        src: "./index.js",
                        dest: "./build/index.js"
                    }
                ]
            }
        },
        // 打包后压缩文件
        // 压缩文件和入口文件一一对应
        uglify: {
            options: {
                banner: '<%= banner %>',
                beautify: {
                    ascii_only: true
                }
            },
            base: {
                files: {
                    './build/index-min.js': ['./build/index.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {src: ['./index.css'], dest: './build/index.css'}
                ]
            }
        },
        cssmin: {
            combine: {
                files: {
                    './build/index-min.css': ['./build/index.css']
                }
            }
        }
    });

    // 使用到的任务，可以增加其他任务
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-kmc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    return grunt.registerTask('default', ['kmc', 'uglify']);
};