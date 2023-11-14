import psl from 'psl'

export async function hostnameToUrlActivity (hostname: string): Promise<string> {
  // Check if the hostname is valid and make a URL for it
  const parsedHostname = psl.parse(hostname)

  if (parsedHostname.error != null) {
    // Sometimes, there is an actual URL here. Let's try that before we give up
    try {
      const result = new URL(hostname)
      return result.toString()
    } catch (err) {
      throw new Error(`Invalid hostname ${hostname}`)
    }
  } else {
    // Create a URL from the hostname
    const result = new URL(`http://${hostname}`)
    return result.toString()
  }
}
