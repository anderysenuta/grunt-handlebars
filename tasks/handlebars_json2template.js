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
      arrTemplates = [],
      langTemplates = [],
      lang = [];

    this.files.forEach(function(f) {
      if (f.dest === 'template') {
        f.src.forEach(function(filepath){
          var nameDir = filepath.split("/").pop(),
            tempArrLang = {};

          grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename){
            var temp = filename.split(".");
            if (temp[1] === "json") {
              var isNewLang = lang.some(function(item){
                return item === temp[0];
              });
              if(!isNewLang) lang.push(temp[0]);
              tempArrLang[temp[0]] = abspath;
            }
            if (temp[1] === "html") {
              arrTemplates.push({
                nameTmp: nameDir,
                src: abspath
              })
            }
          });
          langTemplates.push({
            nameTemplate: nameDir,
            src: tempArrLang
          })
        });
      }
    });

    lang.forEach(function(lng){
      grunt.file.mkdir(config.path + lng);

      arrTemplates.forEach(function(tmpl){
        var template = Handlebars.compile(grunt.file.read(tmpl.src)),
          data = {},
          nameFile = tmpl["src"].split("/").pop();

        langTemplates.forEach(function(currTempLang){
          if(currTempLang.nameTemplate === tmpl.nameTmp && currTempLang['src'][lng]){
            data = grunt.file.readJSON(currTempLang['src'][lng]);

            if(tmpl.nameTmp === "index") {
              grunt.file.write(config.path + lng +"/"+ nameFile, template(data));
            }else {
              grunt.file.write(config.path + lng + "/"+ tmpl.nameTmp +"/"+ nameFile, template(data));
            }
          }
        });
      })
    });
  });
};
