module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          '../dist/scripts.min.js': ['main.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};