import psl from 'psl'

export const validUrl = (url: string): boolean => {
  let validUrl
  try {
    validUrl = new URL(url)
  } catch (_) {
    return false
  }
  return ['http:', 'https:'].includes(validUrl.protocol)
}

export const noDocument = (url: string): boolean => {
  return Boolean(url && !url.toLowerCase().endsWith('.pdf') && !url.toLowerCase().endsWith('.docx'))
}

/**
 * Returns true if given urls have the same origin, subdomain and port
 *
 * Note: some on-premise systems will be hosted on a subdomain
 *       with a separate port, e.g:
 *       "netfreight.well.uk.com:444" is a Descartes system
 *
 */
export const filterExternalDomain = (a: string, b: string): boolean => {
  const urlA = new URL(a)
  const urlB = new URL(b)
  const aParsed = psl.parse(urlA.hostname)
  const bParsed = psl.parse(urlB.hostname)

  if (aParsed.error ?? bParsed.error) {
    return false
  } else {
    // Pleasing Typescript. Is there a cleaner way?
    const castAParsed = aParsed
    const castBParsed = bParsed
    return castAParsed.domain === castBParsed.domain &&
      castAParsed.subdomain === castBParsed.subdomain &&
      urlA.port === urlB.port
  }
}

/**
 * Return true if the given URL is not part of a set of generic Domains.
 *
 * @param url
 */
export const filterKnownDomains = (url: string): boolean => {
  const { hostname, protocol } = new URL(url)
  const domain = psl.get(hostname) ?? ''
  return ![
    'express.dhl',
    'linkedin.com',
    'doubleclick.net',
    'fedex.com',
    'lever.co',
    'adsrvr.org',
    'cbp.gov',
    'cookiepedia.co.uk',
    'sharethis.com',
    'wpengine.com',
    'captcha-delivery.com',
    'clickcertain.com',
    'squarespace-cdn.com',
    'spotify.com',
    'hcaptcha.com',
    'joc.com',
    'telegram.me',
    'youtube-nocookie.com',
    'iata.org',
    'whitehouse.gov',
    'adobe.com',
    'wikipedia.org',
    'outlook.com',
    'hotjar.com',
    'mailchi.mp',
    'tiktok.com',
    'allaboutcookies.org',
    'cookieinformation.com',
    'tripadvisor.co.uk',
    'amazon.com',
    'fda.gov',
    'google.co.uk',
    'embedly.com',
    'youtube.com',
    'facebook.com',
    'twitter.com',
    'google.com',
    'google.es',
    'google.fr',
    'mozilla.org',
    'apple.com',
    'microsoft.com',
    'opera.com',
    'openstreetmap.org',
    'google-analytics.com',
    'zoominfo.com',
    'livechatinc.com',
    'instagram.com',
    'youtu.be',
    'googleapis.com',
    'akamaihd.net',
    'indeed.com',
    'goo.gl',
    'vimeo.com',
    'calendly.com',
    'craigslist.com',
    'flickr.com',
    'hubspot.com',
    'whatsapp.com',
    'tumblr.com',
    'pinterest.com',
    'doubleclick.net',
    'businesswire.com',
    'www.globenewswire.com'
  ].includes(domain) && !['mailto:', 'tel:'].includes(protocol)
}
