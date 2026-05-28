import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // TODO: 외부 날씨 API 연동
  // WEATHER_API_KEY 사용

  return {
    data: {
      temperature: 20,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 10
    },
    error: null,
    message: 'Weather data retrieved successfully'
  }
})
