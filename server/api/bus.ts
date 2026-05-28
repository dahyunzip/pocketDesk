import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // TODO: 외부 버스 API 연동
  // BUS_API_KEY, BUS_STATION_ID 사용

  return {
    data: [
      {
        busNumber: '100',
        nextArrival: 5,
        destination: 'Station A'
      },
      {
        busNumber: '200',
        nextArrival: 12,
        destination: 'Station B'
      }
    ],
    error: null,
    message: 'Bus information retrieved successfully'
  }
})
