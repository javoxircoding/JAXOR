export function getSubscriptionStatus(store: { plan: string; createdAt: Date; trialEndsAt: Date }) {
  const now = new Date()
  const endsAt = new Date(store.trialEndsAt)
  
  // Высчитываем разницу в днях
  const diffTime = endsAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: "Muzlatilgan (Muddati tugagan)", color: "text-red-500", daysLeft: 0 }
  }

  // Если план не STARTER (или если у тебя STARTER — это бесплатный триал)
  if (store.plan !== 'STARTER') {
    // Форматируем дату в удобный вид: "Оплачено до 25.06.2026"
    const formattedDate = endsAt.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    return { text: `Faol (Gacha: ${formattedDate})`, color: "text-green-500", daysLeft: diffDays }
  }

  // Если это обычный бесплатный пробный период (TRIAL)
  return { text: `${diffDays} kun qoldi (Trial)`, color: "text-yellow-500", daysLeft: diffDays }
}