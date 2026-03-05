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

function analyzeClasses(classes, file) {
  const report = {
    padding: {},
    margin: {},
    radius: {},
    container: {}
  }

  classes.forEach(cls => {
    const add = (group) => {
      if (!report[group][cls]) report[group][cls] = []
      report[group][cls].push(file)
    }

    if (cls.startsWith("px-") || cls.startsWith("py-")) add("padding")
    if (cls.startsWith("m-") || cls.startsWith("mx-") || cls.startsWith("my-")) add("margin")
    if (cls.startsWith("rounded")) add("radius")
    if (cls.startsWith("max-w")) add("container")
  })

  return report
}

module.exports = { extractClasses, analyzeClasses }