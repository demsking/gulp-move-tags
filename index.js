/**
 * gulp-move-tags
 * Copyright(c) 2015 Sébastien Demanou
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var es = require('event-stream')
  , gutil = require('gulp-util')
  , cheerio = require('cheerio');

var stream = function(buffer) {
    return es.map(function (file, cb) {
        try {
            file.contents = new Buffer( buffer( String(file.contents) ));
        } catch (err) {
            return cb(new gutil.PluginError('gulp-move-tags', err));
        }
        cb(null, file);
    });
};

module.exports = function() {    
    return stream(function(file_contents) {
        var $ = cheerio.load(file_contents);
        var selector_cmds = {'move-before': 'before', 'move-to': 'append', 'move-after': 'after'};
        
        for (var selector in selector_cmds) {
            $('[' + selector + ']').each(function() {
                var selector_target = $(this).attr(selector);
                
                if (selector_target.length) {
                    var tag = $(this).clone();
                    
                    $(this).remove();
                    tag.removeAttr(selector);
                    
                    $(selector_target)[selector_cmds[selector]](tag);
                }
            });
        }

        return $.html();
    });
};