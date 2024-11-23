const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua data dokter
router.get('/', (req, res) => {
    db.query('SELECT * FROM dokter', (err, results) => {
        if (err) return res.status(500).send('Kesalahan Server Internal');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan data dokter berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM dokter WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Kesalahan Server Internal');
        if (results.length === 0) return res.status(404).send('Dokter tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan data dokter baru
router.post('/', (req, res) => {
    const { nama, spesialisasi, telepon, email } = req.body;
    if (!nama || !spesialisasi || !telepon || !email) {
        return res.status(400).send('Semua data dokter wajib diisi');
    }

    db.query(
        'INSERT INTO dokter (nama, spesialisasi, telepon, email) VALUES (?, ?, ?, ?)',
        [nama.trim(), spesialisasi.trim(), telepon.trim(), email.trim()],
        (err, results) => {
            if (err) return res.status(500).send('Kesalahan Server Internal');
            const newDokter = {
                id: results.insertId,
                nama: nama.trim(),
                spesialisasi: spesialisasi.trim(),
                telepon: telepon.trim(),
                email: email.trim()
            };
            res.status(201).json(newDokter);
        }
    );
});

// Endpoint untuk memperbarui data dokter berdasarkan ID
router.put('/:id', (req, res) => {
    const { nama, spesialisasi, telepon, email } = req.body;

    if (!nama && !spesialisasi && !telepon && !email) {
        return res.status(400).send('Minimal satu data dokter harus diupdate');
    }

    db.query(
        'UPDATE dokter SET nama = COALESCE(?, nama), spesialisasi = COALESCE(?, spesialisasi), telepon = COALESCE(?, telepon), email = COALESCE(?, email) WHERE id = ?',
        [nama, spesialisasi, telepon, email, req.params.id],
        (err, results) => {
            if (err) return res.status(500).send('Kesalahan Server Internal');
            if (results.affectedRows === 0) return res.status(404).send('Dokter tidak ditemukan');
            res.json({ id: req.params.id, nama, spesialisasi, telepon, email });
        }
    );
});

// Endpoint untuk menghapus data dokter berdasarkan ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM dokter WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Kesalahan Server Internal');
        if (results.affectedRows === 0) return res.status(404).send('Dokter tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
