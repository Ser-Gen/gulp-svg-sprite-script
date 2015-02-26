# gulp-svg-sprite-script
Gulp plugin to pack separate svg icons to cachable script.

---

Этот документ [на русском](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/README_RU.md).

---

## Installation

```
npm install git://github.com/Ser-Gen/gulp-svg-sprite-script.git
```

## How to use

### Options

Plugin uses temoplates [`icons-tmpl.js`](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/icons-tmpl.js) and [`icons-tmpl.css`](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/icons-tmpl.css) to generate a script.

You can use options `jsTmpl` and `cssTmpl` to specify path to your templates. You must use `%SVG_SPRITE%` and `%STYLE%` in script template.


### Using plugin

For example, you have svg icons in folder `icons` and want to use custom css and js templates. Gulpfile may looks like this:

```js
var gulp = require('gulp');
var svgSpriteScript = require('gulp-svg-sprite-script');

gulp.task('createSprite', function(){
    return gulp.src('icons/*.svg')
        .pipe(svgSpriteScript({
            jsTmpl: 'icons/script-tmpl.js',
            cssTmpl: 'icons/style-tmpl.css'
        }))
        .pipe(gulp.dest('dest'));
});

gulp.task('default', ['createSprite']);
```

In folder `dest` you will get 3 files:

- `icons.svg` — svg sprite
- `icons.js` — script with sprite
- `icons.html` — preview


### Using generated script

This html

```html
<div data-icon="phone" data-mod="size-m,actions-phone"></div>
```

will transform by script to that:

```html
<div class="icon icon--phone icon--size-m icon--actions-phone"><svg class="icon__cnt"><use xlink:href="#icon-phone"/></svg></div>
```
