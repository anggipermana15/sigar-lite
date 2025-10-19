/**
 * utils.js
 * Berisi fungsi-fungsi pembantu untuk manajemen data di localStorage dan perhitungan.
 */

const STORAGE_KEY = 'sigarLiteData';
export const FOOD_DATABASE = [
    // Makanan Pokok & Karbohidrat
    { name: "Nasi Putih", calories: 175, unit: "per 100g" }, //
    { name: "Nasi Merah", calories: 110, unit: "per 100g" }, //
    { name: "Roti Tawar (Slices)", calories: 149, unit: "per 60g (2 iris)" }, //
    { name: "Singkong Rebus", calories: 146, unit: "per 100g" }, //
    { name: "Mi Goreng Instan", calories: 350, unit: "per bungkus" }, //

    // Lauk Pauk (Protein)
    { name: "Telur Rebus", calories: 97, unit: "per 1 butir" }, //
    { name: "Tempe Goreng", calories: 118, unit: "per 50g (1 potong)" }, //
    { name: "Tahu Bacem", calories: 147, unit: "per 100g" }, //
    { name: "Ayam Bakar Bumbu Kuning", calories: 129, unit: "per 100g" }, //
    { name: "Daging Panggang", calories: 150, unit: "per 70g" }, //
    
    // Makanan Siap Saji/Komplit
    { name: "Gado Gado", calories: 295, unit: "per 150g (1 porsi)" }, //
    { name: "Ketoprak", calories: 153, unit: "per 250g (1 porsi)" }, //
    { name: "Sop Ayam", calories: 95, unit: "per 100g" }, //
    { name: "Hamburger", calories: 257, unit: "per 125g" }, //
    { name: "Martabak Telur", calories: 196, unit: "per 95g (1 potong)" }, //

    // Buah & Sayuran
    { name: "Apel", calories: 92, unit: "per 160g (1 buah sedang)" }, //
    { name: "Pisang", calories: 105, unit: "per 1 buah sedang" }, //
    { name: "Pepaya", calories: 46, unit: "per 100g" }, //
    
    // Makanan Ringan
    { name: "Lumpia", calories: 76, unit: "per 60g (1 buah)" }, //
    { name: "Bubur Kacang Ijo", calories: 102, unit: "per 100g (1 porsi)" } //
];
/**
 * Mendapatkan data dari localStorage.
 * Jika data belum ada, kembalikan struktur data awal.
 * @returns {object} Data aplikasi, berisi array makanan dan aktivitas.
 */
export function getData() {
    const dataString = localStorage.getItem(STORAGE_KEY);
    if (dataString) {
        return JSON.parse(dataString);
    }
    // Struktur data awal
    return {
        makanan: [],
        aktivitas: []
    };
}

/**
 * Menyimpan objek data ke localStorage.
 * @param {object} data - Objek data yang akan disimpan.
 */
export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Menambahkan entri baru (makanan atau aktivitas) ke data.
 * @param {string} type - Tipe entri ('makanan' atau 'aktivitas').
 * @param {string} name - Nama item/aktivitas.
 * @param {number} calories - Jumlah kalori.
 */
export function addEntry(type, name, calories) {
    const data = getData();
    const newEntry = {
        id: Date.now(), // ID unik berdasarkan timestamp
        name: name,
        calories: parseInt(calories)
    };

    if (type === 'makanan') {
        data.makanan.push(newEntry);
    } else if (type === 'aktivitas') {
        data.aktivitas.push(newEntry);
    }

    saveData(data);
}

/**
 * Menghitung total kalori masuk, keluar, dan sisa.
 * @returns {object} Objek yang berisi totalMasuk, totalKeluar, dan sisaKalori.
 */
export function calculateTotals() {
    const data = getData();
    
    // Hitung total kalori masuk (makanan)
    const totalMasuk = data.makanan.reduce((sum, item) => sum + item.calories, 0);

    // Hitung total kalori keluar (aktivitas)
    const totalKeluar = data.aktivitas.reduce((sum, item) => sum + item.calories, 0);

    // Hitung sisa kalori
    const sisaKalori = totalMasuk - totalKeluar;

    return {
        totalMasuk,
        totalKeluar,
        sisaKalori
    };
}

/**
 * Menghapus entri berdasarkan tipe dan ID.
 * @param {string} type - Tipe entri ('makanan' atau 'aktivitas').
 * @param {number} id - ID unik dari entri yang akan dihapus.
 */
export function deleteEntry(type, id) {
    const data = getData();

    if (type === 'makanan') {
        data.makanan = data.makanan.filter(item => item.id !== id);
    } else if (type === 'aktivitas') {
        data.aktivitas = data.aktivitas.filter(item => item.id !== id);
    }

    saveData(data);
}