export default defineEventHandler(async (event) => {
  const apiKey = process.env.BUS_API_KEY
  const arsNo = process.env.BUS_ARS_NO

  if (!apiKey || !arsNo) {
    return {
      data: null,
      error: 'BUS_API_KEY and BUS_ARS_NO environment variables are required',
      message: 'Missing environment variables'
    }
  }

  try {
    const url = `https://busan.bus.go.kr/bus3.0/xmlpush/xmlArrList.xml?key=${apiKey}&arsno=${arsNo}`
    console.log('🚌 Fetching bus info from:', url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/xml'
      }
    })

    clearTimeout(timeoutId)
    console.log('✅ Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API error response:', errorText.substring(0, 200))
      return {
        data: null,
        error: `API responded with status ${response.status}`,
        message: 'Bus API returned an error'
      }
    }

    const xmlText = await response.text()
    console.log('📦 XML response length:', xmlText.length)
    console.log('📋 XML sample:', xmlText.substring(0, 200))

    const buses = parseBusXml(xmlText)
    console.log('✨ Parsed buses:', JSON.stringify(buses))

    return {
      data: buses,
      error: null,
      message: 'Bus arrival information retrieved successfully'
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    const errorCode = err instanceof Error && 'code' in err ? (err as any).code : 'UNKNOWN'
    console.error('🚌 Bus API error:', errorMsg)
    console.error('Error code:', errorCode)

    return {
      data: null,
      error: errorMsg,
      message: 'Failed to fetch bus information'
    }
  }
})

interface BusInfo {
  lineno: string
  min1: number
  min2: number
  bustype: string
}

const parseBusXml = (xml: string): BusInfo[] => {
  const buses: BusInfo[] = []

  const itemRegex = /<bus[^>]*>([\s\S]*?)<\/bus>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]

    const linenoMatch = itemXml.match(/<routeNo[^>]*>([\s\S]*?)<\/routeNo>/i)
    const min1Match = itemXml.match(/<arrivalMin1[^>]*>([\s\S]*?)<\/arrivalMin1>/i)
    const min2Match = itemXml.match(/<arrivalMin2[^>]*>([\s\S]*?)<\/arrivalMin2>/i)
    const bustypeMatch = itemXml.match(/<busType[^>]*>([\s\S]*?)<\/busType>/i)

    const lineno = linenoMatch ? linenoMatch[1].trim() : ''
    const min1 = min1Match ? parseInt(min1Match[1].trim(), 10) : 0
    const min2 = min2Match ? parseInt(min2Match[1].trim(), 10) : 0
    const bustype = bustypeMatch ? bustypeMatch[1].trim() : ''

    if (lineno) {
      buses.push({ lineno, min1, min2, bustype })
    }
  }

  return buses
}
