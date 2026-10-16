// Konfigurasi - URL Web App Apps Script Anda
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyOsYYBsbqmzBoTYpLqKuGOrYh4psCf0Rd4B1VE7_WR0S0E1CclDtiurzrEKxVNbn0K/exec';

// Fungsi untuk menampilkan alert
function showAlert(type, message) {
    const successAlert = document.getElementById('alertSuccess');
    const errorAlert = document.getElementById('alertError');
    
    if (type === 'success') {
        successAlert.textContent = message;
        successAlert.style.display = 'block';
        errorAlert.style.display = 'none';
    } else {
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        successAlert.style.display = 'none';
    }
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';
    }, 5000);
}

// Handle Form Submit
const izinForm = document.getElementById('izinForm');
if (izinForm) {
    izinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');
        
        // Disable button dan tampilkan loading
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        // Kumpulkan data form
        const formData = {
            namaLengkap: document.getElementById('namaLengkap').value,
            kelas: document.getElementById('kelas').value,
            hari: document.getElementById('hari').value,
            tanggal: document.getElementById('tanggal').value,
            jam: document.getElementById('jam').value,
            bulan: document.getElementById('bulan').value,
            yangMemberiIzin: document.getElementById('yangMemberiIzin').value,
            alasan: document.getElementById('alasan').value
        };
        
        try {
            // Kirim data ke Google Apps Script menggunakan POST
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('success', '✅ Data berhasil disimpan!');
                izinForm.reset();
            } else {
                showAlert('error', '❌ Error: ' + result.message);
            }
            
        } catch (error) {
            showAlert('error', '❌ Terjadi kesalahan jaringan: ' + error.message);
        } finally {
            // Enable button kembali
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

// Fungsi untuk load data di dashboard
async function loadData() {
    const selectedClass = document.getElementById('selectClass') ? document.getElementById('selectClass').value : '';
    const loading = document.getElementById('loading');
    const dataContainer = document.getElementById('dataContainer');
    
    if (!loading || !dataContainer) return;
    
    loading.style.display = 'block';
    dataContainer.innerHTML = '';
    
    try {
        if (selectedClass) {
            // Load data kelas tertentu
            const response = await fetch(`${WEB_APP_URL}?class=${encodeURIComponent(selectedClass)}`);
            const result = await response.json();
            
            loading.style.display = 'none';
            
            if (result.success && result.data && result.data.length > 0) {
                displayTable(result.data, selectedClass);
            } else {
                dataContainer.innerHTML = '<div class="no-data">Tidak ada data untuk kelas ' + selectedClass + '</div>';
            }
        } else {
            // Load semua data
            const response = await fetch(`${WEB_APP_URL}?all=true`);
            const allData = await response.json();
            
            loading.style.display = 'none';
            
            let hasData = false;
            let allHTML = '';
            
            for (const [className, data] of Object.entries(allData)) {
                if (data && data.length > 0) {
                    hasData = true;
                    allHTML += `<h3 style="margin-top:30px; color:#1e884e; border-bottom: 2px solid #1e884e; padding-bottom: 5px;">Kelas ${className}</h3>`;
                    allHTML += createTableHTML(data);
                }
            }
            
            if (hasData) {
                dataContainer.innerHTML = allHTML;
            } else {
                dataContainer.innerHTML = '<div class="no-data">Belum ada data izin</div>';
            }
        }
        
    } catch (error) {
        loading.style.display = 'none';
        dataContainer.innerHTML = `<div class="no-data" style="color:red;">Error memuat data: ${error.message}</div>`;
    }
}

// Fungsi untuk menampilkan tabel
function displayTable(data, className) {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = createTableHTML(data, className);
}

// Fungsi untuk membuat HTML tabel
function createTableHTML(data, className = '') {
    const headers = ['Nama Lengkap', 'Kelas', 'Hari', 'Tanggal', 'Jam', 'Bulan', 'Yang Memberi Izin', 'Alasan Keluar'];
    
    let html = `
        <table>
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach(row => {
        html += `
            <tr>
                <td>${row['Nama Lengkap'] || '-'}</td>
                <td>${row['Kelas'] || className || '-'}</td>
                <td>${row['Hari'] || '-'}</td>
                <td>${row['Tanggal'] || '-'}</td>
                <td>${row['Jam'] || '-'}</td>
                <td>${row['Bulan'] || '-'}</td>
                <td>${row['Yang Memberi Izin'] || '-'}</td>
                <td>${row['Alasan Keluar'] || '-'}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    return html;
}

// Fungsi print
function printData() {
    window.print();
}

// Load data saat halaman dashboard dibuka
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('dataContainer')) {
        loadData();
    }
});
