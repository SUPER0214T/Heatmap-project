import { atom } from 'recoil';

export const themeState = atom<boolean>({
	key: 'themeState',
	default: false,
});

// 새로운 차트 데이터 형태 [{date: "202111", wakeUpDateTrack: [27, 28], wakeUpTimeTrack: ["1.8"], sleepDateTrack: [1, 2], sleepTimeTrack: ["1.8"] }]
// [{date: "2021-11", chartData: { wakeUp: {}, sleep: {} } }]
// date가 현재 날짜인가? 맞으면 안에 있는 데이터들을 가져와서 보여줌 / 아니라면 새로운 객체를 만들어서 저장함
// console.log(date.getFullYear(), date.getMonth() + 1); 둘 다 number임 근데 0추가하려면 string이어야 함 -> date: 20221되는데 202201로 바꾸려면 10보다 작을 때 0 추가해주는 방식 하면 됨
export interface IChartData {
	date: string;
	wakeUpDateTrack: number[];
	wakeUpTimeTrack: string[];
	sleepDateTrack: number[];
	sleepTimeTrack: string[];
}
export const chartData = atom<IChartData[]>({
	key: 'chartData',
	default: [],
});
