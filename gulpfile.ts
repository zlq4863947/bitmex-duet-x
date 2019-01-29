import * as gulp from 'gulp';
import * as sass from 'gulp-sass';
import * as path from 'path';
const rename = require("gulp-rename");

function importer(url: string) {
  if (url[0] === '~') {
    url = path.resolve('./node_modules', url.substr(1));
  }

  return { file: url };
}

function createStorybookTask(task: string, src: string, name: string) {
  gulp.task(`:sass:storybook:${task}`, () => {
    return gulp.src(src)
    .pipe(sass({
      outputStyle: 'compressed',
      importer:importer,
    }).on('error', sass.logError))
    .pipe(rename(name))
    .pipe(gulp.dest('./.storybook/assets-to-serve'));
  });
}

const storybookTasks =[
  {
    task: 'styles',
    src: './src/app/@theme/styles/styles.scss',
    rename: 'styles.css'
  },
  {
    task: 'bootstrap',
    src: './node_modules/bootstrap/dist/css/bootstrap.css',
    rename: 'bootstrap.css'
  },
  {
    task: 'typeface-exo',
    src: './node_modules/typeface-exo/index.css',
    rename: 'typeface-exo.css'
  },
  {
    task: 'roboto',
    src: './node_modules/roboto-fontface/css/roboto/roboto-fontface.css',
    rename: 'roboto-fontface.css'
  },
  {
    task: 'ionicons',
    src: './node_modules/ionicons/scss/ionicons.scss',
    rename: 'ionicons.css'
  },
  {
    task: 'fontawesome',
    src: './node_modules/@fortawesome/fontawesome-free/css/all.css',
    rename: 'fontawesome-free.css'
  },
  {
    task: 'socicon',
    src: './node_modules/socicon/css/socicon.css',
    rename: 'socicon.css'
  },
  {
    task: 'nebular-icons',
    src: './node_modules/nebular-icons/scss/nebular-icons.scss',
    rename: 'nebular-icons.css'
  },
  /*{
    task: 'pace-theme-flash',
    src: './node_modules/pace-js/templates/pace-theme-flash.tmpl.css'
  },*/
]

storybookTasks.map(o => createStorybookTask(o.task, o.src, o.rename));

gulp.task('build:assets-for-storybook', storybookTasks.map(o=>`:sass:storybook:${o.task}`));
