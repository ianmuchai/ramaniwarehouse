export const RAMANI_WHATSAPP = '+254793371994';

export function whatsappUrl({ phone = RAMANI_WHATSAPP, text = '' } = {}) {
  const digits = String(phone).replace(/\D/g, '');
  const normalized = digits.startsWith('254') ? digits : `254${digits.replace(/^0+/, '')}`;
  return `https://wa.me/${normalized}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}