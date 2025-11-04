export function truncateText(text: string, countWord: number): string {
  if (!text) return "";

  // Pisahkan teks menjadi array kata
  const words = text.trim().split(/\s+/);

  // Jika kata lebih sedikit dari batas, kembalikan teks asli
  if (words.length <= countWord) {
    return text;
  }

  // Potong dan tambahkan "..."
  const truncated = words.slice(0, countWord).join(" ");
  return `${truncated}...`;
}
