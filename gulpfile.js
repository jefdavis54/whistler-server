const gulp = require("gulp");

function copyNonTypescript(cb) {
  gulp.src(["./src/**/*", "!./**/*.ts", "!./**/*.tsx"]).pipe(gulp.dest("dist"));
  cb();
}

exports.default = copyNonTypescript;
