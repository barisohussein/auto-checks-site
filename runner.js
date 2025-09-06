const { spawn } = require("child_process");
const path = require("path");

// List all check scripts
const checks = [
  "homepageCheck.js",
  "searchCheck.js",
  //"addToCartCheck.js",
 // "checkoutPageCheck.js",
  "brokenLinksCheck.js",
  "performanceCheck.js",
  "uptimeCheck.js",
  "sslCertCheck.js"
];

async function runCheck(file) {
  return new Promise((resolve) => {
    const proc = spawn("node", [path.join(__dirname, "checks", file)], {
      stdio: "pipe",
    });

    let output = "";
    proc.stdout.on("data", (data) => (output += data.toString()));
    proc.stderr.on("data", (data) => (output += data.toString()));

    proc.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${file} passed`);
      } else {
        console.error(`❌ ${file} failed`);
      }
      console.log(output.trim());
      console.log("--------------------------------------------------");
      resolve(code);
    });
  });
}

(async () => {
  console.log("🚀 Running all site health checks...\n");

  let failed = 0;

  for (const check of checks) {
    const code = await runCheck(check);
    if (code !== 0) failed++;
  }

  if (failed > 0) {
    console.error(`❌ ${failed} check(s) failed`);
    process.exit(1);
  } else {
    console.log("🎉 All checks passed!");
  }
})();
