import dns from 'dns'
const dnsPromises = dns.promises

export async function resolveHostActivity (host: string): Promise<string[]> {
  try {
    return await dnsPromises.resolveCname(host)
  } catch (err) {
    return []
  }
}
