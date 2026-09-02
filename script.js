// DATASET AWAL (DUMMY SAMPLE)
let datasetStok = [
    { nama: "Minyak Goreng 2L", stok: "Sedikit", penjualan: "Tinggi", leadTime: "Lama", urgensi: "Urgen" },
    { nama: "Gula Pasir 1kg", stok: "Banyak", penjualan: "Rendah", leadTime: "Cepat", urgensi: "Tidak Urgen" }
];

// PERPINDAHAN 3 TAB
function openTab(tabId, element) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    document.getElementById(tabId).classList.add("active");
    element.classList.add("active");
}

// ALGORITMA DECISION TREE C4.5
function classifyC45(stok, penjualan, leadTime) {
    if (stok === "Sedikit") {
        if (penjualan === "Tinggi") {
            return "Urgen";
        } else {
            return leadTime === "Lama" ? "Urgen" : "Sedang";
        }
    } else if (stok === "Sedang") {
        return "Sedang";
    } else {
        return "Tidak Urgen";
    }
}

// UPDATE STATISTIK DASBOR
function updateStats() {
    const urgenCount = datasetStok.filter(item => item.urgensi === "Urgen").length;
    const sedangCount = datasetStok.filter(item => item.urgensi === "Sedang").length;
    const amanCount = datasetStok.filter(item => item.urgensi === "Tidak Urgen").length;

    document.getElementById("countUrgen").innerText = urgenCount;
    document.getElementById("countSedang").innerText = sedangCount;
    document.getElementById("countAman").innerText = amanCount;
}

// RENDER TABEL UTAMA
function renderTable(dataToRender = datasetStok) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (dataToRender.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:20px;">Belum ada data barang tersimpan.</td></tr>`;
        updateStats();
        return;
    }

    dataToRender.forEach((item, index) => {
        let badgeClass = item.urgensi === "Urgen" ? "badge-urgen" : item.urgensi === "Sedang" ? "badge-sedang" : "badge-tidak-urgen";
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${item.nama}</strong></td>
                <td>${item.stok}</td>
                <td>${item.penjualan}</td>
                <td>${item.leadTime}</td>
                <td><span class="badge ${badgeClass}">${item.urgensi}</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    updateStats();
}

// HANDLER INPUT MANUAL
document.getElementById("formManual").addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = document.getElementById("namaBarang").value.trim();
    const stok = document.getElementById("sisaStok").value;
    const penjualan = document.getElementById("penjualan").value;
    const leadTime = document.getElementById("leadTime").value;

    const urgensi = classifyC45(stok, penjualan, leadTime);
    datasetStok.unshift({ nama, stok, penjualan, leadTime, urgensi });

    renderTable();
    this.reset();
    alert("Data berhasil diklasifikasikan!");

    // Otomatis pindah ke Tab 3 (Hasil)
    const tabTabelBtn = document.querySelectorAll(".tab-btn")[2];
    openTab("tabel-hasil", tabTabelBtn);
});

// HANDLER UPLOAD CSV
const fileInput = document.getElementById("fileCsv");
if (fileInput) {
    fileInput.addEventListener("change", function () {
        const fileName = this.files[0] ? this.files[0].name : "Pilih atau seret berkas .CSV di sini";
        document.querySelector(".file-msg").innerText = fileName;
    });
}

document.getElementById("formImport").addEventListener("submit", function (e) {
    e.preventDefault();
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const rows = e.target.result.split("\n");
            let countSuccess = 0;

            for (let i = 1; i < rows.length; i++) {
                if (rows[i].trim() === "") continue;
                const cols = rows[i].split(",");
                if (cols.length >= 4) {
                    const nama = cols[0].trim();
                    const stok = cols[1].trim();
                    const penjualan = cols[2].trim();
                    const leadTime = cols[3].trim();

                    if (nama) {
                        const urgensi = classifyC45(stok, penjualan, leadTime);
                        datasetStok.unshift({ nama, stok, penjualan, leadTime, urgensi });
                        countSuccess++;
                    }
                }
            }
            renderTable();
            alert(`Berhasil mengimpor ${countSuccess} data barang!`);
            fileInput.value = "";
            document.querySelector(".file-msg").innerText = "Pilih atau seret berkas .CSV di sini";

            // Otomatis pindah ke Tab 3 (Hasil)
            const tabTabelBtn = document.querySelectorAll(".tab-btn")[2];
            openTab("tabel-hasil", tabTabelBtn);
        };
        reader.readAsText(file);
    }
});

// FILTER TABLE STATUS
function filterTable(status, element) {
    document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("active"));
    element.classList.add("active");
    if (status === "all") renderTable(datasetStok);
    else renderTable(datasetStok.filter(item => item.urgensi === status));
}

// RESET ALL DATA
function clearAllData() {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh data?")) {
        datasetStok = [];
        renderTable();
    }
}

document.addEventListener("DOMContentLoaded", () => renderTable());