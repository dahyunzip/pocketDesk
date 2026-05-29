// 기상청 단기예보조회 API를 호출하는 백엔드 라우트입니다
// 부산지역의 날씨 정보를 조회합니다

interface WeatherItem {
    baseDate: string; // 기준 날짜
    baseTime: string; // 기준 시간
    category: string; // 예보 항목 (온도, 습도, 강수 등)
    fcstDate: string; // 예보 날짜
    fcstTime: string; // 예보 시간
    fcstValue: string; // 예보 값
    nx: number; // 격자 X 좌표
    ny: number; // 격자 Y 좌표
}

interface WeatherResponse {
    response: {
        header: {
            resultCode: string;
            resultMsg: string;
        };
        body: {
            dataType: string;
            items: {
                item: WeatherItem | WeatherItem[];
            };
            pageNo: string;
            numOfRows: string;
            totalCount: string;
        };
    };
}

// 주요 도시의 격자 좌표 (기상청 예보 구역)
const locationCoordinates: { [key: string]: { nx: number; ny: number; name: string } } = {
    seoul: { nx: 60, ny: 127, name: "서울" },
    incheon: { nx: 55, ny: 124, name: "인천" },
    busan: { nx: 74, ny: 131, name: "부산" },
    daegu: { nx: 89, ny: 106, name: "대구" },
    daejeon: { nx: 67, ny: 100, name: "대전" },
    gwangju: { nx: 58, ny: 74, name: "광주" },
    ulsan: { nx: 102, ny: 84, name: "울산" },
    sejong: { nx: 66, ny: 103, name: "세종" },
    gyeonggi: { nx: 60, ny: 120, name: "경기도" },
    gangwon: { nx: 73, ny: 134, name: "강원도" },
    chungbuk: { nx: 77, ny: 115, name: "충청북도" },
    chungnam: { nx: 68, ny: 100, name: "충청남도" },
    jeonbuk: { nx: 63, ny: 89, name: "전라북도" },
    jeonnam: { nx: 51, ny: 67, name: "전라남도" },
    gyeongbuk: { nx: 87, ny: 106, name: "경상북도" },
    gyeongnam: { nx: 80, ny: 75, name: "경상남도" },
    jeju: { nx: 52, ny: 38, name: "제주도" },
};

export default defineEventHandler(async (event) => {
    const serviceKey = process.env.API_KEY;
    const apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

    if (!serviceKey) {
        throw createError({
            statusCode: 500,
            statusMessage: "날씨 API 키가 설정되지 않았습니다",
        });
    }

    try {
        // 쿼리 파라미터에서 지역 코드 받기 (기본값: busan)
        const query = getQuery(event);
        const locationCode = (query.location as string) || "busan";

        // 해당 지역의 좌표 가져오기
        const location = locationCoordinates[locationCode] || locationCoordinates["busan"];
        const nx = location!.nx;
        const ny = location!.ny;

        // 현재 시간 기준으로 API 요청할 시간 계산합니다
        // 기상청 API는 매 시간 XX:10 분에 업데이트됩니다
        const now = new Date();
        let baseTime = Math.floor(now.getHours() / 3) * 3 - 1; // 3시간 단위로 이전 시간
        if (baseTime < 0) baseTime = 23; // 자정 전이면 전날 23시

        const isoString = now.toISOString();
        const datePart = isoString.split("T")[0] || "";
        const baseDate = datePart.replace(/-/g, ""); // YYYYMMDD 형식
        const baseTimeStr = String(baseTime).padStart(2, "0") + "00"; // HHmm 형식

        // API 파라미터 구성
        const params = new URLSearchParams({
            serviceKey: serviceKey,
            pageNo: "1",
            numOfRows: "1000", // 최대한 많이 받아서 충분한 예보 데이터 확보
            dataType: "JSON",
            base_date: baseDate,

            base_time: baseTimeStr,
            nx: nx.toString(),
            ny: ny.toString(),
        });

        // 기상청 API로 요청
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const data: WeatherResponse = await response.json();

        return {
            success: data.response.header.resultCode === "00",
            baseDate,
            baseTime: baseTimeStr,
            location: location!.name,
            coordinates: { nx, ny },
            data,
        };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "날씨 조회 실패",
        });
    }
});
