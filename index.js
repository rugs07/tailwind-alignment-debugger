#!/usr/bin/env node

const fs = require("fs")
const glob = require("glob")
const { extractClasses, analyzeClasses } = require("./analyzer")

const files = glob.sync("**/*.{js,jsx,ts,tsx,html}", {
  ignore: "node_modules/**"
})

let allClasses = []

files.forEach(file => {
  const content = fs.readFileSync(file, "utf8")
  const classes = extractClasses(content)
  allClasses.push(...classes)
})

const report = analyzeClasses(allClasses)

console.log("\nTailwind Alignment Debugger Report\n")

function printSection(title, data) {
  const keys = Object.keys(data)
  if (keys.length > 1) {
    console.log(`⚠ ${title}`)
    keys.forEach(k => {
      console.log(`${k} → ${data[k]} usages`)
    })
    console.log("")
  }
}

printSection("Padding inconsistencies detected", report.padding)
printSection("Margin inconsistencies detected", report.margin)
printSection("Border radius inconsistencies", report.radius)
printSection("Multiple container widths", report.container)

console.log("Scan complete.\n")