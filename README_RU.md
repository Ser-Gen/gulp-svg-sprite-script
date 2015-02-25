# gulp-svg-sprite-script

Плагин для [Галпа](https://github.com/gulpjs/gulp), упаковывающий изображения в формате `svg` в скрипт для удобного использования.

Чтобы управлять отображением векторных пиктограмм из стилей, пиктограммы должны находиться в разметке страницы.

Для предотвращения совпадения идентификатора фигуры с существующим на странице, 


## Установка

```
npm install git://github.com/Ser-Gen/gulp-svg-sprite-script.git
```


## Настройка

Скрипт генерируется из шаблона `[icons-tmpl.js](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/icons-tmpl.js)`, вместе с пиктограммами в него интегрируются стили отсюда `[icons-tmpl.css](https://github.com/Ser-Gen/gulp-svg-sprite-script/blob/master/icons-tmpl.css)`.

Собственные файлы можно передавать в параметрах `jsTmpl` и `cssTmpl`.

В шаблоне скрипта должны быть заглушки для подстановки склеенных пиктограмм и стилей: `%SVG_SPRITE%` и `%STYLE%` соответственно.


## Использование

Допустим, в папке `icons` находятся пиктограммы. Используются нестандартные шаблоны стилей и скрипта. В этом случае, файл `gulpfile.js` можно будет настроить так:

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
- `icons.js` — скрипт с пиктограммами
- `icons.html` — демонстрационный файл со всеми пиктограммами


## Использование скрипта

Скрипт нужно подключить как можно ближе к началу документа.

В разметке объявите заглушку для пиктограммы. У неё два параметра:
- `data-icon` для указания имени пиктограммы
- `data-mod` для добавления модификатора. Несколько модификаторов указываются через запятую: `data-mod="size-m,actions"`.

```html
<div data-icon="iconname" data-mod="size-m,actions"></div>
```

