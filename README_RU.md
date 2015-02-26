# gulp-svg-sprite-script

Плагин для [Галпа](https://github.com/gulpjs/gulp), упаковывающий изображения в формате `svg` в скрипт для удобного использования.


## Установка

```
npm install git://github.com/Ser-Gen/gulp-svg-sprite-script.git
```


## Настройка

Скрипт генерируется из шаблона [`icons-tmpl.js`](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/icons-tmpl.js), вместе с изображениями в него интегрируются стили отсюда: [`icons-tmpl.css`](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/icons-tmpl.css).

Собственные шаблоны можно передавать в параметрах `jsTmpl` и `cssTmpl`.

В шаблоне скрипта должны быть заглушки для подстановки склеенных изображений и стилей: `%SVG_SPRITE%` и `%STYLE%` соответственно.


## Использование

Допустим, в папке `icons` находятся `svg`-пиктограммы. Также, используются нестандартные шаблоны стилей и скрипта. В этом случае, файл `gulpfile.js` настраивается так:

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

После выполнения задачи в папке `dest` должно появиться несколько файлов:

- `icons.svg` — склейка («спрайт») из пиктограмм
- `icons.js` — скрипт со склейкой
- `icons.html` — демонстрационный файл со всеми пиктограммами


## Использование сгенерированного скрипта

Чтобы все преобразования проиходили быстро, скрипт нужно подключить как можно ближе к началу документа.

В разметке объявите заглушку для пиктограммы. У неё два параметра:
- `data-icon` для указания имени пиктограммы
- `data-mod` для добавления модификатора. Несколько модификаторов указываются через запятую.

Исходная разметка

```html
<div data-icon="phone" data-mod="size-m,actions-phone"></div>
```

будет преобразована скриптом в это

```html
<div class="icon icon--phone icon--size-m icon--actions-phone"><svg class="icon__cnt"><use xlink:href="#icon-phone"/></svg></div>
```
