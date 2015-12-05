
var fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    mocha = require('mocha'),
    assert = require('assert'),
    cheerio = require('cheerio'),
    moveTags = require('../');

var file = fs.readFileSync(path.join(__dirname, './src/index.html'));

describe('gulp-move-tags', function() {
    
    describe('find and move tags', function() {
        var fakeFile;
        
        beforeEach(function() {
            fakeFile = new gutil.File({
                base: 'tests/src',
                cwd: 'tests/',
                path: 'tests/src/index.html',
                contents: new Buffer(file)
            });
        });
        
        it('should find and move decorated tags in the file', function(done) {
            var stream = moveTags({
                done: function(contents) {
                    console.log(contents);
                    
                    $ = cheerio.load(contents);
                    
                    done();
                }
            });
            
            stream.write(fakeFile);
        });
    });
    
});
