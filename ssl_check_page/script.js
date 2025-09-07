async function loadSSLResults() {
    const res = await fetch("results.json");
    const data = await res.json();
    const table = document.getElementById("ssl-table");
  
    data.forEach(entry => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td class="border px-4 py-2">${entry.domain}</td>
        <td class="border px-4 py-2">${entry.validTo || "—"}</td>
        <td class="border px-4 py-2">${entry.daysRemaining ?? "—"}</td>
        <td class="border px-4 py-2">${entry.status || entry.error}</td>
      `;
  
      if (entry.status?.includes("⚠️")) {
        row.classList.add("bg-yellow-100");
      } else if (entry.error) {
        row.classList.add("bg-red-100");
      } else {
        row.classList.add("bg-green-100");
      }
  
      table.appendChild(row);
    });
  }
  
  loadSSLResults();
  