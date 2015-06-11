/*
 * grunt-handlebars-json2template
 * https://github.com/anderysenuta/grunt-handlebars
 *
 * Copyright (c) 2015 andrei_senuta
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var Handlebars = require("handlebars");

  grunt.registerMultiTask('handlebars_json2template', 'The best Grunt plugin ever.', function() {
    var config = this.data,
      template = [],
      templateData = [];

    grunt.file.mkdir(config.path);

    this.files.forEach(function(f) {
      if (f.dest === 'src') {
        f.src.filter(function (filepath) {
          template.push(filepath);
        });
      }
      if (f.dest === 'templateData') {
        f.src.filter(function (filepath) {
          templateData.push(filepath);
        });
      }
    });

    template.forEach(function(tmp){
      var source = grunt.file.read(tmp),
        urlArr = tmp.split("/").reverse()[0].split(".");


      templateData.forEach(function(tmpData){
        var template = Handlebars.compile(source),
          name = tmpData.split("/").reverse()[0].split(".")[0],
          fullUrl = urlArr[0] + "." + name + "." + urlArr[1],
          json = grunt.file.readJSON(tmpData);

        grunt.file.write(config.path + fullUrl, template(json));

      });
    });
  });
};
