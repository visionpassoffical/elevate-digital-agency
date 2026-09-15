/**
 * Central WhatsApp Communication Utility for ELEVATE
 * WhatsApp Target: +91 94971 22397
 *
 * Implements centralized deep-linking, URL encoding, and the exact message
 * generation formats specified for ELEVATE's enquiry-to-WhatsApp workflow.
 */

import { BRAND_CONFIG } from '../data/brandConfig';

/**
 * Returns the currently active WhatsApp phone digits from central storage or fallback.
 */
export function getActiveWhatsAppDigits(): string {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('elevate_site_content_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.contact?.whatsappDigits) {
          return parsed.contact.whatsappDigits;
        }
        if (parsed.contact?.whatsappNumber) {
          const digits = parsed.contact.whatsappNumber.replace(/\D/g, '');
          if (digits) return digits;
        }
      }
    } catch {
      // fallback
    }
  }
  return BRAND_CONFIG.whatsappDigits;
}

export function getActiveWhatsAppDisplay(): string {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('elevate_site_content_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.contact?.whatsappNumber) {
          return parsed.contact.whatsappNumber;
        }
      }
    } catch {
      // fallback
    }
  }
  return BRAND_CONFIG.whatsappNumber;
}

export const WHATSAPP_PHONE = BRAND_CONFIG.whatsappDigits; // 919497122397
export const WHATSAPP_DISPLAY = BRAND_CONFIG.whatsappNumber; // +91 94971 22397

/**
 * Builds a valid WhatsApp Web / Mobile deep link with properly encoded message.
 */
export function getWhatsAppUrl(messageText: string, phoneDigits?: string): string {
  const cleanMessage = messageText.trim();
  const encodedText = encodeURIComponent(cleanMessage);
  const digits = phoneDigits || getActiveWhatsAppDigits();
  return `https://wa.me/${digits}?text=${encodedText}`;
}

/**
 * Opens WhatsApp in a new browser tab or native app with prefilled text.
 */
export function openWhatsApp(messageText: string, phoneDigits?: string): boolean {
  const digits = phoneDigits || getActiveWhatsAppDigits();
  const display = getActiveWhatsAppDisplay();
  try {
    const cleanMessage = (messageText || '').trim();
    if (!cleanMessage) {
      throw new Error('Message is empty');
    }
    const url = getWhatsAppUrl(cleanMessage, digits);
    if (typeof window !== 'undefined') {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.href = url;
      }
    }
    return true;
  } catch {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('elevate:whatsapp-error', {
          detail: {
            message: "We couldn't prepare the WhatsApp message. Please try again.",
            fallbackNumber: display,
            fallbackUrl: `https://wa.me/${digits}`,
          },
        })
      );
    }
    return false;
  }
}


/**
 * 1. WEBSITE PACKAGE WHATSAPP MESSAGE
 * Basic: ₹999/year
 * Standard: ₹1,999/year
 */
export function formatWebsitePlanMessage(planName: string, priceWithCycle: string): string {
  // Format matches:
  // “Hello ELEVATE,
  //
  // I’m interested in the [Plan Name] — [Price/year].
  //
  // Please share the details.”
  return `Hello ELEVATE,

I’m interested in the ${planName} — ${priceWithCycle}.

Please share the details.`;
}

/**
 * 2. ADMISSION PACKAGE WHATSAPP MESSAGE
 */
export function formatAdmissionPackageMessage(
  packageName = 'Complete Admission Package',
  price = '₹449'
): string {
  return `Hello ELEVATE,

I’m interested in the ${packageName} — ${price}.

Please share the details.`;
}

/**
 * 3. EXAM PACKAGE WHATSAPP MESSAGE
 */
export function formatExamPackageMessage(
  packageName = 'Complete Exam Package',
  price = '₹499'
): string {
  return `Hello ELEVATE,

I’m interested in the ${packageName} — ${price}.

Please share the details.`;
}

/**
 * 4. ADMISSION INDIVIDUAL SERVICES WHATSAPP MESSAGE
 */
export function formatIndividualAdmissionMessage(
  services: { name: string; price: number }[],
  total: number
): string {
  const serviceLines = services
    .map((s) => `• ${s.name} — ₹${s.price}`)
    .join('\n');

  return `Hello ELEVATE,

I would like to enquire about these services:

${serviceLines}

Estimated Total: ₹${total.toLocaleString('en-IN')}

Please share the details.`;
}

/**
 * 5. EXAM INDIVIDUAL SERVICES WHATSAPP MESSAGE
 */
export function formatIndividualExamMessage(
  services: { name: string; price: number }[],
  total: number
): string {
  const serviceLines = services
    .map((s) => `• ${s.name} — ₹${s.price}`)
    .join('\n');

  return `Hello ELEVATE,

I would like to enquire about these exam services:

${serviceLines}

Estimated Total: ₹${total.toLocaleString('en-IN')}

Please share the details.`;
}

/**
 * 6. MONTHLY CREATIVE PLAN WHATSAPP MESSAGE
 */
export function formatMonthlyPlanMessage(
  planName: string,
  priceFormatted: string,
  creativesCount: number
): string {
  const priceWithCycle = priceFormatted.includes('/month') ? priceFormatted : `${priceFormatted}/month`;
  return `Hello ELEVATE,

I’m interested in the ${planName} — ${priceWithCycle}.

Includes ${creativesCount} creatives per month.

Please share the details.`;
}

/**
 * 7. BULK SERVICES: ID CARDS WHATSAPP MESSAGE
 */
export function formatBulkIdCardsMessage(
  quantity: number,
  unitRate: number,
  total: number
): string {
  return `Hello ELEVATE,

I’m interested in bulk ID cards.

Quantity: ${quantity}
Applicable rate: ₹${unitRate}/card
Estimated Total: ₹${total.toLocaleString('en-IN')}

Please share the details.`;
}

/**
 * 7. BULK SERVICES: CERTIFICATES WHATSAPP MESSAGE
 */
export function formatBulkCertificatesMessage(
  quantity: number,
  unitRate: number,
  total: number,
  includeBaseDesign = false
): string {
  const designLine = includeBaseDesign ? '\nBase Certificate Design: Included (+₹149)' : '';

  return `Hello ELEVATE,

I’m interested in bulk certificates.

Quantity: ${quantity}
Applicable rate: ₹${unitRate}/certificate${designLine}
Estimated Total: ₹${total.toLocaleString('en-IN')}

Please share the details.`;
}

/**
 * 8. SIMPLE ENQUIRY WHATSAPP MESSAGE
 * Formatted for the simplified requirement CTA.
 */
export function formatDigitalServicesEnquiryMessage(): string {
  return `Hello ELEVATE,
I would like to enquire about your digital services.
Please share the details and pricing.`;
}

/**
 * 8b. CUSTOM SERVICES DISCUSSION WHATSAPP MESSAGE
 */
export function formatCustomServicesDiscussionMessage(serviceName?: string): string {
  if (!serviceName) {
    return formatDigitalServicesEnquiryMessage();
  }
  return `Hello ELEVATE,

I would like to discuss custom services for our school:

• ${serviceName}

Please let me know how we can proceed.`;
}

/**
 * 8c. CUSTOM QUOTE WHATSAPP MESSAGE
 */
export function formatCustomQuoteMessage(serviceName?: string): string {
  return formatCustomServicesDiscussionMessage(serviceName);
}

/**
 * General consultation message
 */
export function formatGeneralInquiryMessage(topic = 'digital services'): string {
  return `Hello ELEVATE,

I would like to enquire about your ${topic}.

Please share the details and pricing.`;
}

/**
 * COMBINED SELECTION MESSAGE
 * Used when multiple sections are selected simultaneously in the SelectionDockBar.
 */
export function formatCombinedOrderMessage(params: {
  admission?: { mode: 'package' | 'individual'; services?: { name: string; price: number }[]; total: number };
  exam?: { mode: 'package' | 'individual'; services?: { name: string; price: number }[]; total: number };
  website?: { name: string; price: string };
  monthly?: { name: string; price: string; creatives: number };
  bulk?: { title: string; quantity: number; unitPrice: number; total: number; note?: string };
  grandTotal: number;
}): string {
  const sections: string[] = [];

  if (params.website) {
    sections.push(`Website Plan:\n• ${params.website.name} — ${params.website.price}`);
  }

  if (params.admission) {
    if (params.admission.mode === 'package') {
      sections.push(`Admission Solution:\n• Complete Admission Package — ₹449`);
    } else if (params.admission.services && params.admission.services.length > 0) {
      const items = params.admission.services.map((s) => `  • ${s.name} — ₹${s.price.toLocaleString('en-IN')}`).join('\n');
      sections.push(`Admission Services:\n${items}\n  Subtotal: ₹${params.admission.total.toLocaleString('en-IN')}`);
    }
  }

  if (params.exam) {
    if (params.exam.mode === 'package') {
      sections.push(`Exam Solution:\n• Complete Exam Package — ₹499`);
    } else if (params.exam.services && params.exam.services.length > 0) {
      const items = params.exam.services.map((s) => `  • ${s.name} — ₹${s.price.toLocaleString('en-IN')}`).join('\n');
      sections.push(`Exam Services:\n${items}\n  Subtotal: ₹${params.exam.total.toLocaleString('en-IN')}`);
    }
  }

  if (params.monthly) {
    sections.push(
      `Monthly Creative Plan:\n• ${params.monthly.name} — ${params.monthly.price} (${params.monthly.creatives} creatives/month)`
    );
  }

  if (params.bulk) {
    sections.push(
      `Bulk Services:\n• ${params.bulk.title} (Qty: ${params.bulk.quantity}, @ ₹${params.bulk.unitPrice}/unit) — ₹${params.bulk.total.toLocaleString('en-IN')}`
    );
  }

  return `Hello ELEVATE,

I would like to enquire about the following selected services:

${sections.join('\n\n')}

Estimated Total: ₹${params.grandTotal.toLocaleString('en-IN')}

Please share the details.`;
}
