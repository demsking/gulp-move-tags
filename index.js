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
  , jsdom = require("jsdom").jsdom;

var attributes = ['move-before', 'move-to', 'move-after'];

function getDoctype(document) {
    var node = document.doctype;
    
    return  "<!DOCTYPE "
            + node.name
            + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
            + (!node.publicId && node.systemId ? ' SYSTEM' : '') 
            + (node.systemId ? ' "' + node.systemId + '"' : '')
            + '>';
}

function getAllElementsWithAttribute(document, attribute) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) !== null) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}

module.exports = function(options) {
    options = options || {};
    
    return es.map(function (file, cb) {
        try {
            var document = jsdom(String(file.contents));
            var window = document.defaultView;
        
            attributes.forEach(function(attribute) {
                getAllElementsWithAttribute(document, attribute).forEach(function(element) {
                    var selector = element.getAttribute(attribute);
                    var pseudo = '';
                    var targets = null;
                    var target = null;
                    
                    // Find pseudo class
                    var tmp = selector.split(':');
                    
                    if (tmp.length == 2) {
                        selector = tmp[0];
                        pseudo = tmp[1];
                    }
                    
                    targets = document.querySelectorAll(selector);
                    
                    switch (pseudo) {
                        case 'first-child':
                            target = targets[0];
                            break;
                            
                        case 'last-child':
                        default:
                            target = targets[targets.length - 1];
                            break;
                    }
                    
                    element.removeAttribute(attribute);
                    element.parentNode.removeChild(element);
                    
                    switch (attribute) {
                        case 'move-before':
                            target.parentNode.insertBefore(element, target);
                            break;
                            
                        case 'move-to':
                            target.innerHTML += element.outerHTML;
                            break;
                            
                        case 'move-after':
                            target.parentNode.insertBefore(element, target.nextSibling);
                            break;
                    }
                })
            });
            
            if (typeof options.done == 'function') {
                options.done(document, function(doc) {
                    if (doc) {
                        document = doc;
                    }
                    
                    file.contents = new Buffer(getDoctype(document) + document.documentElement.outerHTML);
                    cb(null, file);
                })
            } else {
                file.contents = new Buffer(getDoctype(document) + document.documentElement.outerHTML);
                cb(null, file);
            }
        } catch (err) {
            throw new gutil.PluginError('gulp-move-tags', err);
        }
    });
};
