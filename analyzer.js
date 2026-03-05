const fs = require("fs")

function extractClasses(content) {
  const classRegex = /class(Name)?=["'`]([^"'`]*)["'`]/g
  let match
  let classes = []

  while ((match = classRegex.exec(content))) {
    classes.push(...match[2].split(" "))
  }

  return classes
}

function analyzeClasses(classes) {
  const report = {
    padding: {},
    margin: {},
    radius: {},
    container: {}
  }

  classes.forEach(cls => {
    if (cls.startsWith("px-") || cls.startsWith("py-")) {
      report.padding[cls] = (report.padding[cls] || 0) + 1
    }

    if (cls.startsWith("m-") || cls.startsWith("mx-") || cls.startsWith("my-")) {
      report.margin[cls] = (report.margin[cls] || 0) + 1
    }

    if (cls.startsWith("rounded")) {
      report.radius[cls] = (report.radius[cls] || 0) + 1
    }

    if (cls.startsWith("max-w")) {
      report.container[cls] = (report.container[cls] || 0) + 1
    }
  })

  return report
}

module.exports = { extractClasses, analyzeClasses }