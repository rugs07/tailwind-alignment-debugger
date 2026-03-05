#!/usr/bin/env node

const fs = require("fs")
const glob = require("glob")
const chalk = require("chalk")
const { extractClasses, analyzeClasses } = require("./analyzer")

const files = glob.sync("**/*.{js,jsx,ts,tsx,html}", {
  ignore: "node_modules/**"
})

let report = {
  padding: {},
  margin: {},
  radius: {},
  container: {}
}

files.forEach(file => {
  const content = fs.readFileSync(file, "utf8")
  const classes = extractClasses(content)
  const result = analyzeClasses(classes, file)

  Object.keys(report).forEach(key => {
    Object.keys(result[key]).forEach(cls => {
      if (!report[key][cls]) report[key][cls] = []
      report[key][cls].push(...result[key][cls])
    })
  })
})

console.log(chalk.bold("\n🔍 Tailwind Alignment Debugger Report\n"))

function printSection(title, data) {
  const keys = Object.keys(data)

  if (keys.length > 1) {
    console.log(chalk.yellow(`⚠ ${title}`))

    keys.forEach(k => {
      console.log(chalk.cyan(`  ${k}`))
      data[k].forEach(file => {
        console.log(chalk.gray(`     → ${file}`))
      })
    })

    console.log("")
  }
}

printSection("Padding inconsistencies", report.padding)
printSection("Margin inconsistencies", report.margin)
printSection("Border radius inconsistencies", report.radius)
printSection("Multiple container widths", report.container)

console.log(chalk.green("✔ Scan complete\n"))