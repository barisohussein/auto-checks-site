const tls = require("tls");

const baseDomains = [
  "brooksrunning.com",
  "brooksrunning.ca",
  "brooksrunning.eu"
];

const EXPIRY_THRESHOLD_DAYS = 20;

// Generate both www and non-www versions
const domains = baseDomains.flatMap(d => [d, `www.${d}`]);

function checkSSL(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      host: domain,
      port: 443,
      servername: domain,
      rejectUnauthorized: false, // allow self-signed for testing
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();
      socket.end();

      if (!cert.valid_to) {
        return reject(new Error(`No expiry date found for ${domain}`));
      }

      const expiryDate = new Date(cert.valid_to);
      const now = new Date();
      const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24);

      if (diffDays <= EXPIRY_THRESHOLD_DAYS) {
        return reject(new Error(`SSL certificate for ${domain} expires in ${Math.round(diffDays)} days`));
      }

      resolve(`✅ SSL certificate for ${domain} is valid until ${expiryDate.toISOString()} (${Math.round(diffDays)} days remaining)`);
    });

    socket.on("error", (err) => reject(new Error(`TLS error for ${domain}: ${err.message}`)));
  });
}

(async () => {
  try {
    for (const domain of domains) {
      const result = await checkSSL(domain);
      console.log(result);
    }
  } catch (err) {
    console.error("❌ SSL check failed:", err.message);
    process.exit(1);
  }
})();
