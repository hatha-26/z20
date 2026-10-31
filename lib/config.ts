// ✏️ EDIT FILE INI SAJA untuk mempersonalisasi website.

export const config = {
  name: "Sayang",
  dateText: "20 Oktober",
  from: "Aku",

  story: [
    {
      emoji: "🌷",
      text: "Ada satu hari dalam setahun\nyang bikin dunia jadi lebih manis.",
    },
    { emoji: "✨", text: "Dan hari itu\nadalah hari ini." },
    {
      emoji: "🥹",
      text: "Terima kasih sudah lahir,\ndan terima kasih sudah jadi kamu.",
    },
    {
      emoji: "🎀",
      text: "Jadi scroll terus ya.\nAda beberapa hal kecil buat kamu.",
    },
  ],

  // Taruh foto di /public/photos lalu isi src, contoh: "/photos/1.jpg". Kosong = placeholder emoji.
  photos: [
    { src: "/photos/1.jpg", emoji: "🍜", caption: "..." },
    { src: "/photos/3.jpg", emoji: "🎡", caption: "...", focus: "50% 100%" },
    { src: "/photos/2.jpg", emoji: "🌅", caption: "..." },
    { src: "/photos/4.jpg", emoji: "🐱", caption: "..." },
    { src: "/photos/5.jpg", emoji: "☕", caption: "..." },
    { src: "/photos/6.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/7.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/8.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/9.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/10.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/11.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/12.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/13.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/14.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/15.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/16.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/17.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/18.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/19.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/20.jpg", emoji: "🌧️", caption: "..." },
    { src: "/photos/21.jpg", emoji: "🌧️", caption: "..." },
  ],

  reasons: [
    {
      emoji: "😆",
      front: "Tawamu",
      back: "Ketawa kamu itu obat paling ampuh buat hari-hariku yang jelek.",
    },
    {
      emoji: "🫶",
      front: "Kebaikanmu",
      back: "Kamu baik ke semua orang, dan itu bikin aku makin kagum.",
    },
    {
      emoji: "🍳",
      front: "Kecerewetanmu",
      back: "Cerewet kamu itu bentuk perhatian. Aku tahu, dan aku suka.",
    },
    {
      emoji: "🌙",
      front: "Kamu di malam hari",
      back: "Ngobrol sama kamu sebelum tidur adalah bagian favoritku.",
    },
    {
      emoji: "💪",
      front: "Semangatmu",
      back: "Lihat kamu berjuang bikin aku ikut jadi lebih kuat.",
    },
    {
      emoji: "🏡",
      front: "Rumahku",
      back: "Di dekat kamu, rasanya selalu seperti pulang.",
    },
  ],

  letter:
    "Hai sayang,\n\nSelamat ulang tahun ya. Semoga tahun ini dengan usia baru penuh hal-hal baik yang, tawa yang banyak, dan mimpi-mimpimu satu per satu jadi nyata.\n\nTerima kasih sudah sabar, sudah hangat, dan sudah jadi tempat paling nyaman buat aku pulang. Aku bahagia memiliki kamu, aku bangga mendapatkan kamu, aku suka disamping kamu, membayangkan hal hal indah bersama yang semoga bisa terwujud.\n\nApa pun yang terjadi, aku mau ada di sebelahmu.",

  // Quiz pembuka (layar pertama, sebelum kejutan). Ganti sesuka hati.
  // Quiz pembuka (dijawab dengan SUARA). Sumber: proyeksi US Census Bureau, penduduk dunia ±8,2 miliar (2026).
  quiz: {
    question: "Berapa jumlah penduduk dunia saat ini?",
    answerBillions: 8.2, // jawaban benar, dalam miliar
    toleranceBillions: 0.3, // 7,9 s/d 8,5 miliar dianggap benar
    rightText: "Betul! Sekitar 8,2 miliar orang di dunia 🌏",
    wrongText: "Hampir! Jawabannya sekitar 8,2 miliar orang 🌏",
  },

  // Lilin padam otomatis mengikuti lagu tahap "candle" (tidak ada tombol tiup).
  candle: {
    fallbackSeconds: 64, // dipakai jika file lagu tidak ada / diblokir browser
    blowAt: [42, 46, 53], // detik lagu kapan tiap lilin padam (lilin kiri -> kanan)
  },

  // Musik 3 tahap. Taruh file mp3 di /public/music/
  music: {
    open: "/music/1-open.mp3",
    candle: "/music/2-tiup-lilin.mp3",
    final: "/music/3-final.mp3",
  },
};
