const { spawn } = require("child_process");
const path = require("path");

// List all checks here
const checks = [
  "homepageCheck.js",
  "searchCheck.js",
  "addToCartCheck.js",
  "checkoutPageCheck.js",
  "brokenLinksCheck.js",
  "performanceCheck.js",
  "uptimeCheck.js",
  "sslCheck.js",
  "cookieConsentCheck.js",
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
      resolve();
    });
  });
}

(async () => {
  console.log("🚀 Running all site health checks...\n");

  for (const check of checks) {
    await runCheck(check);
  }

  console.log("🎉 All checks finished!");
})();
