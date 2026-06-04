import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

const WHATSAPP_NUMBER = '13055551040';
const WHATSAPP_MESSAGE = encodeURIComponent('Hi Vault Tax, I would like to get in touch.');

export function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-105 hover:bg-[#20ba5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
