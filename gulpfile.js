const gulp = require("gulp");

function copyNonTypescript(cb) {
  gulp.src(["./src/working/**/*", "!./**/*.ts", "!./**/*.tsx"]).pipe(gulp.dest("dist"));
  cb();
}

exports.default = copyNonTypescript;
