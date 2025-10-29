interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Bagaimana cara bergabung di Connectify?",
    answer: "Anda dapat mendaftar sebagai freelancer atau klien melalui halaman registrasi. Isi data diri lengkap dan verifikasi akun Anda.",
  },
  {
    id: 2,
    question: "Apakah bergabung di Connectify gratis?",
    answer: "Ya, pendaftaran di Connectify sepenuhnya gratis. Kami hanya mengenakan biaya layanan untuk transaksi tertentu.",
  },
  {
    id: 3,
    question: "Bagaimana sistem pembayaran di Connectify?",
    answer: "Pembayaran dilakukan melalui sistem escrow untuk menjamin keamanan kedua belah pihak, dan akan diteruskan setelah proyek selesai.",
  },
  {
    id: 4,
    question: "Apakah saya bisa menarik saldo ke rekening pribadi?",
    answer: "Tentu, Anda dapat melakukan penarikan saldo kapan saja melalui menu keuangan di dashboard Anda.",
  },
];
