import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const supportLinks = document.querySelectorAll('[data-contact-support]');
const supportMessage = 'Hello TD Support, I need assistance';
let whatsappUrl = null;
let supportLoadError = null;

onAuthStateChanged(auth, async (user) => {
  whatsappUrl = null;
  supportLoadError = null;

  if (!user) {
    supportLoadError = new Error('An authenticated user is required to load support contact details.');
    return;
  }

  try {
    const supportSnapshot = await getDoc(doc(db, 'admin', 'support'));
    if (!supportSnapshot.exists()) {
      throw new Error('The admin/support document does not exist.');
    }

    const phoneNumber = String(supportSnapshot.data().whatsapp || '').replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(phoneNumber)) {
      throw new Error('The WhatsApp number in admin/support is missing or invalid.');
    }

    whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(supportMessage)}`;
  } catch (error) {
    supportLoadError = error;
    console.error('Unable to load the TD Support WhatsApp number:', error);
  }
});

supportLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    if (!whatsappUrl) {
      const message = supportLoadError?.message.includes('authenticated user')
        ? 'Please sign in to contact TD Support.'
        : supportLoadError
          ? 'TD Support is temporarily unavailable. Please try again later.'
        : 'Loading TD Support contact details. Please try again in a moment.';
      window.showToast?.(message);
      return;
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
});
