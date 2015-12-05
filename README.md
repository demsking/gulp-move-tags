# gulp-move-tags
Move HTML tabs to another placement - Useful for organize automatically generated codes

## Usage

```html

<!doctype html>
<html>
    <head>
        <title>Test file</title>
        <meta name="description" content="Magna irure qui ad anim eiusmod laborum magna.">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
        <meta charset="utf-8" move-before="title">
    </head>
    <body>
        <script src="script.js" move-after="script:last-child"></script>
        
        <h1>Page title</h1>
        
        <section id="main"></section>
        <section id="another-section"></section>
        
        <p move-to="section:first-child">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus enim leo, ac lacinia purus accumsan sit amet. In ultrices sagittis nulla, ut dapibus urna dignissim eget. Ut ornare posuere augue, non iaculis erat elementum at. Suspendisse vel ipsum id arcu rhoncus eleifend.</p>
        <p move-to="#another-section">Ut blandit mauris sit amet sem lacinia ornare. Ut sagittis ex id purus ultricies imperdiet. Proin gravida mollis ligula, eget tempor risus vehicula sit amet. Phasellus sodales tortor non sapien dapibus, sit amet bibendum lectus vestibulum.</p>
        
        <script src="jquery.min.js"></script>
        <script src="plugins.js"></script>
    </body>
</html>

```

In your `gulpfile.js`, add the task:

```js

var gulp = require('gulp')
  , moveTags = require('gulp-move-tags');

gulp.task('move-tags', function() {
    gulp.src('test/src/index.html')
        .pipe(moveTags())
        .pipe(gulp.dest('build'));
});

// Gulp Default Task
gulp.task('default', ['move-tags']);

```

After build, get:

```html

<html>
    <head>
        <meta charset="utf-8">
        <title>Test file</title>
        <meta name="description" content="Magna irure qui ad anim eiusmod laborum magna.">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    </head>
    <body>
        <h1>Page title</h1>
        
        <section id="main"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus enim leo, ac lacinia purus accumsan sit amet. In ultrices sagittis nulla, ut dapibus urna dignissim eget. Ut ornare posuere augue, non iaculis erat elementum at. Suspendisse vel ipsum id arcu rhoncus eleifend.</p></section>
        <section id="another-section"><p>Ut blandit mauris sit amet sem lacinia ornare. Ut sagittis ex id purus ultricies imperdiet. Proin gravida mollis ligula, eget tempor risus vehicula sit amet. Phasellus sodales tortor non sapien dapibus, sit amet bibendum lectus vestibulum.</p></section>

        <script src="jquery.min.js"></script>
        <script src="plugins.js"></script>
        <script src="script.js"></script>
    </body>
</html>

```

## Using options

The plugin provide options to inspect and change the DOM before the end of the pipe.
```js
var options = {
    done: function(document) {
        // a document
        // inspect and change DOM here
        
        return document; // return document to update changes
    }
}

```