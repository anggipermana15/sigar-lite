/**
 * app.js
 * Berisi logika utama aplikasi, event listener, dan manipulasi DOM.
 */

// Import fungsi dari utils.js
import { getData, addEntry, calculateTotals, deleteEntry, FOOD_DATABASE } from './utils.js';


// 1. Ambil Elemen DOM
const dashboardElement = {
    totalMasuk: document.getElementById('total-masuk'),
    totalKeluar: document.getElementById('total-keluar'),
    sisaKalori: document.getElementById('sisa-kalori'),
};

const formMakanan = document.getElementById('form-makanan');
const formAktivitas = document.getElementById('form-aktivitas');
const makananList = document.getElementById('makanan-list');
const aktivitasList = document.getElementById('aktivitas-list');
const cardSisa = document.getElementById('card-sisa');
const toastElement = document.getElementById('notification-toast'); // Elemen Toast


// Fungsi untuk menampilkan notifikasi Toast
function showToast(message) {
    toastElement.textContent = message;
    toastElement.classList.add('toast-visible');

    // Sembunyikan toast setelah 3 detik
    setTimeout(() => {
        toastElement.classList.remove('toast-visible');
    }, 3000);
}


// Fungsi untuk memicu animasi pada card dashboard
function animateDashboardCard(type) {
    let cardId;
    if (type === 'makanan') {
        cardId = 'card-masuk';
    } else if (type === 'aktivitas') {
        cardId = 'card-keluar';
    }

    const card = document.getElementById(cardId);
    if (card) {
        // Hapus kelas animasi sebelum menambahkannya lagi
        card.classList.remove('flash');
        // Panggil kembali kelas animasi untuk memicu animasi ulang
        void card.offsetWidth; // Hack untuk memicu reflow DOM
        card.classList.add('flash');
    }
}


// 2. Fungsi Rendering Dashboard
function renderDashboard() {
    const totals = calculateTotals();

    // Tampilkan total
    dashboardElement.totalMasuk.textContent = `${totals.totalMasuk} Kcal`;
    dashboardElement.totalKeluar.textContent = `${totals.totalKeluar} Kcal`;
    dashboardElement.sisaKalori.textContent = `${totals.sisaKalori} Kcal`;

    // Beri warna pada card sisa kalori (indikator visual)
    if (totals.sisaKalori >= 0) {
        cardSisa.style.backgroundColor = '#E8F5E9'; // Hijau Muda untuk positif/nol
        dashboardElement.sisaKalori.style.color = 'var(--color-primary)';
    } else {
        cardSisa.style.backgroundColor = '#FFEBEE'; // Merah Muda untuk negatif
        dashboardElement.sisaKalori.style.color = 'var(--color-danger)';
    }
}


// 3. Fungsi Rendering Riwayat (Tabel)
function renderHistory() {
    const data = getData();
    
    // Kosongkan tabel sebelum merender ulang
    makananList.innerHTML = '';
    aktivitasList.innerHTML = '';

    // Render Makanan
    data.makanan.forEach(item => {
        const row = createRow(item, 'makanan');
        makananList.appendChild(row);
    });

    // Render Aktivitas
    data.aktivitas.forEach(item => {
        const row = createRow(item, 'aktivitas');
        aktivitasList.appendChild(row);
    });
}

/**
 * Membuat baris (tr) untuk tabel. (Sama seperti sebelumnya)
 */
function createRow(item, type) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.calories}</td>
        <td>
            <button class="btn-delete" data-id="${item.id}" data-type="${type}">Hapus</button>
        </td>
    `;
    return row;
}


// 4. Handler Form Submission dengan Validasi
function handleFormSubmit(event, type) {
    event.preventDefault();

    let nameInput, kaloriInput;
    let typeName = type === 'makanan' ? 'Makanan' : 'Aktivitas';

    if (type === 'makanan') {
        nameInput = document.getElementById('makanan-pilih');
        kaloriInput = document.getElementById('makanan-kalori');
    } else {
        nameInput = document.getElementById('aktivitas-nama');
        kaloriInput = document.getElementById('aktivitas-kalori');
    }

    const selectedOption = nameInput.options[nameInput.selectedIndex];
    const name = selectedOption.dataset.name;
    const calories = parseInt(kaloriInput.value);

    // --- Validasi Input ---
    if (!name || name === "") {
        alert(`Mohon masukkan Nama ${typeName}.`);
        return;
    }

    if (isNaN(calories) || calories <= 0) {
        alert(`Mohon masukkan Kalori ${typeName} yang valid (angka positif).`);
        return;
    }
    // --- Akhir Validasi Input ---

    // Panggil fungsi tambah data
    addEntry(type, name, calories);

    // Perbarui tampilan
    renderDashboard();
    renderHistory();
    
    // Tampilkan notifikasi berhasil
    showToast(`${typeName} "${name}" (${calories} Kcal) berhasil ditambahkan!`);

    // Tambahkan animasi ke card dashboard
    animateDashboardCard(type);

    // Reset form
    event.target.reset();
}


// 5. Handler Hapus Entri (Sama seperti sebelumnya)
function handleDelete(event) {
    if (event.target.classList.contains('btn-delete')) {
        const id = parseInt(event.target.dataset.id);
        const type = event.target.dataset.type;
        const itemName = event.target.closest('tr').children[0].textContent;

        if (confirm(`Apakah Anda yakin ingin menghapus "${itemName}"?`)) {
            
            deleteEntry(type, id);

            // Perbarui tampilan
            renderDashboard();
            renderHistory();

            showToast(`Entri "${itemName}" berhasil dihapus.`);
        }
    }
}

const selectMakanan = document.getElementById('makanan-pilih');
const inputKalori = document.getElementById('makanan-kalori');
const infoUnit = document.getElementById('info-unit');

function fillFoodDropdown() {
    FOOD_DATABASE.forEach(food => {
        const option = document.createElement('option');
        option.value = food.calories; // Nilai opsi adalah kalorinya
        // Simpan nama makanan di dataset agar bisa diambil saat submit
        option.textContent = `${food.name} (${food.calories} Kcal)`; 
        option.dataset.name = food.name;
        option.dataset.unit = food.unit;
        selectMakanan.appendChild(option);
    });
}

// 6. Event Listeners
formMakanan.addEventListener('submit', (e) => handleFormSubmit(e, 'makanan'));
formAktivitas.addEventListener('submit', (e) => handleFormSubmit(e, 'aktivitas'));
selectMakanan.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];

    // Isi input kalori dengan nilai yang dipilih
    inputKalori.value = e.target.value; 

    // Tampilkan info unit
    if (selectedOption.dataset.unit) {
        infoUnit.textContent = `Kalori ini adalah ${selectedOption.dataset.unit}`;
    } else {
        infoUnit.textContent = '';
    }
});
// Delegasi event listener untuk tombol hapus di kedua tabel
document.getElementById('history-section').addEventListener('click', handleDelete);


// 7. Inisialisasi Aplikasi
function init() {
    renderDashboard();
    renderHistory();
    fillFoodDropdown(); // Panggil fungsi baru ini
}

// Jalankan inisialisasi
init();