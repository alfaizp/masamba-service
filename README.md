# Servis Center · Persona 3 Style

Aplikasi front-end servis (teknisi & pembeli) dengan tema Persona 3. Tanpa framework dan tanpa backend, cukup buka `index.html` di browser.

## Struktur
```
index.html      Login (LOG IN / SIGN UP / RECOVER + pilih peran)
teknisi.html    Beranda, Riwayat Pembeli, Daftar Teknisi
pembeli.html    Beranda (riwayat service) + popup chat
css/login.css   Gaya halaman login
css/app.css     Gaya halaman teknisi & pembeli
js/scene.js     Latar (tangga, gelembung, jam), dipakai semua halaman
js/data.js      Model: data contoh teknisi dan servis
js/login.js     Logika login dan pengalihan sesuai peran
js/app.js       Menu, tampilan halaman, dan chat
```

## Cara pakai
1. Buka `index.html`, isi username dan password (minimal 6 karakter), pilih peran, lalu CONFIRM.
2. Untuk pembeli, isi username dengan nama pada data (mis. `Raka Pratama`) supaya riwayatnya tampil.
3. Status servis (klik di beranda teknisi) disimpan di `localStorage` browser.

## Yang perlu dihubungkan ke backend
- Verifikasi akun di `js/login.js` (bagian `TODO` pada submit).
- Data teknisi dan servis di `js/data.js`.
- Chat di `js/app.js` masih simulasi balasan otomatis.
