# IZIN GO MURID - MAN BANTAENG

Aplikasi pengelolaan izin murid untuk MAN Bantaeng.

## Fitur
- Form input izin murid
- Dashboard monitoring data izin
- 12 sheet untuk setiap kelas (X.1 - XII.4)
- Terintegrasi dengan Google Sheets
- Responsive design

## Cara Deploy

### 1. Setup Google Sheets
- Buat spreadsheet baru
- Buat 12 sheet untuk setiap kelas
- Tambahkan header di setiap sheet

### 2. Setup Google Apps Script
- Buka Extensions > Apps Script
- Copy kode dari Code.gs
- Deploy sebagai Web App
- Copy URL web app

### 3. Update Konfigurasi
- Ganti `WEB_APP_URL` di file `js/script.js`
- Ganti `SPREADSHEET_ID` di file `Code.gs`

### 4. Deploy ke GitHub Pages
- Push semua file ke GitHub
- Aktifkan GitHub Pages
- Akses aplikasi

## Struktur Folder
