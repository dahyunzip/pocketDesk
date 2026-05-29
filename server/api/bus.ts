export default defineEventHandler(async () => {
  const apiKey = process.env.API_KEY
  const arsNo = process.env.BUS_ARS_NO

  if (!apiKey || !arsNo) {
    return {
      data: null,
      error: 'API_KEY and BUS_ARS_NO environment variables are required',
      message: 'Missing environment variables'
    }
  }

  try {
    const url = `http://apis.data.go.kr/6260000/BusanBIMS/bitArrByArsno?arsno=${arsNo}&serviceKey=${apiKey}`
    console.log('🚌 Fetching bus info from:', url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/xml' }
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
  min1: string  // "운행대기" 등 문자열로 올 수 있음
  min2: string
  bustype: string
}

const parseBusXml = (xml: string): BusInfo[] => {
  const buses: BusInfo[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1] ?? ''
    if (!itemXml) continue

    const lineno = itemXml.match(/<lineno>([\s\S]*?)<\/lineno>/)?.[1]?.trim() ?? ''
    const min1 = itemXml.match(/<min1>([\s\S]*?)<\/min1>/)?.[1]?.trim() ?? ''
    const min2 = itemXml.match(/<min2>([\s\S]*?)<\/min2>/)?.[1]?.trim() ?? ''
    const bustype = itemXml.match(/<bustype>([\s\S]*?)<\/bustype>/)?.[1]?.trim() ?? ''

    if (lineno) buses.push({ lineno, min1, min2, bustype })
  }

  return buses
}