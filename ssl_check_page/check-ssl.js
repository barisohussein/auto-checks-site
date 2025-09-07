const tls = require("tls");
const fetch = require("node-fetch");
const fs = require("fs");

const EXPIRY_THRESHOLD_DAYS = 20;

// List of base domains including known locales
const baseDomains = [
  "brooksrunning.com",
  "brooksrunning.ca",
  "brooksrunning.eu",
  "brooksrunning.fi",
  "brooksrunning.se",
  "brooksrunning.uk",
  "brooksrunning.de",
  "brooksrunning.fr",
  "brooksrunning.nl",
  "brooksrunning.ch",
  "brooksrunning.it"
];

// Domains to skip
c// Add these exclusions at the top
const EXCLUSIONS = [
  'talk.brooksrunning.com',
  'www.talk.brooksrunning.com',
  'vmas-vb01.brooksrunning.com',
  'vmbg-cb01.brooksrunning.com',
  'store.brooksrunning.com',
  'esales.brooksrunning.com',
  'www.esales.brooksrunning.com',
  'sweeps.brooksrunning.com',
  'dpqa1.brooksrunning.com',
  'booksservices.prod.brooksrunning.com',
  'adfs.brooksrunning.com',
  'fasttrack-dev.brooksrunning.com',
  'admin.brooksrunning.com',
  'community.brooksrunning.com',
  'community-stage.brooksrunning.com',
  'fasttrack-test.brooksrunning.com',
  'files.brooksrunning.com',
  'autodiscover.local.hq.brooksrunning.com',
  'baker.hq.brooksrunning.com',
  'columbia.hq.brooksrunning.com',
  'email.brooksrunning.com',
  'hq.brooksrunning.com',
  'rainier.brooksrunning.com',
  'access.brooksrunning.com',
  'www.access.brooksrunning.com',
  'insidetrack.brooksrunning.com',
  'login.brooksrunning.com',
  'www.login.brooksrunning.com',
  'mdm.brooksrunning.com',
  'filer-us-east.brooksrunning.com',
  'gts16competicion.brooksrunning.com',
  'gts16competition.brooksrunning.com'
];

// Filter out .info domains dynamically
const domainsToCheck = domains.filter(d => !EXCLUSIONS.includes(d) && !d.includes('.info'));

// Fetch subdomains from crt.sh
async function getSubdomains(baseDomain) {
  const url = `https://crt.sh/?q=%25.${baseDomain}&output=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SSL-Checker/1.0; +https://github.com/yourrepo)"
      },
      timeout: 30000
    });

    if (!res.ok) {
      throw new Error(`crt.sh returned status ${res.status}`);
    }

    const data = await res.json();
    return [...new Set(data.flatMap(entry => entry.name_value.split("\n")))]; 
  } catch (err) {
    console.error(`❌ Failed fetching subs for ${baseDomain}: ${err.message}`);
    return [];
  }
}

// SSL check
function checkSSL(domain) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: domain, port: 443, servername: domain, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();

        if (!cert.valid_to) {
          return resolve({ domain, error: "No expiry date found" });
        }

        const expiryDate = new Date(cert.valid_to);
        const diffDays = (expiryDate - Date.now()) / (1000 * 60 * 60 * 24);

        resolve({
          domain,
          validTo: expiryDate.toISOString(),
          daysRemaining: Math.round(diffDays),
          status: diffDays <= EXPIRY_THRESHOLD_DAYS ? "⚠️ Expiring soon" : "✅ Valid"
        });
      }
    );

    socket.on("error", err => resolve({ domain, error: err.message }));
  });
}

// Main
(async () => {
  let allDomains = [];

  for (const base of baseDomains) {
    const subs = await getSubdomains(base);
    // Include base and www variants
    allDomains.push(...subs, base, `www.${base}`);
  }

  allDomains = [...new Set(allDomains)]; // deduplicate
  // Remove excluded domains
  allDomains = allDomains.filter(d => !exclusions.includes(d));

  console.log(`🔍 Checking SSL for ${allDomains.length} domains...`);

  const results = [];
  for (const d of allDomains) {
    const r = await checkSSL(d);
    results.push(r);

    if (r.error) {
      console.log(`❌ ${r.domain}: ${r.error}`);
    } else if (r.status.includes("⚠️")) {
      console.log(`⚠️ ${r.domain}: expires in ${r.daysRemaining} days`);
    } else {
      console.log(`✅ ${r.domain}: expires in ${r.daysRemaining} days`);
    }
  }

  fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
  console.log("✅ All results written to results.json");
})();
