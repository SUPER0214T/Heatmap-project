import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
	averageTime,
	chartGridColor,
	chartTextColor,
	ChartWrapper,
	Container,
	DeleteButton,
	FormWrapper,
	Title,
} from '../styles/chart-style';
import { useRecoilState } from 'recoil';
import { chartData, IChartData, isChartAtom, themeState } from '../atoms';
import { useNavigate, useParams } from 'react-router';
import { IBtnLink } from './Charts';

interface ISubmitProps {
	wakeUpInput: string;
}

const PageWrapper = styled.div`
	display: flex;
	height: 100vh;
	padding-top: 60px;
	${FormWrapper} {
		padding: 8px;
		min-width: 232px;
		max-width: 300px;
		flex-grow: 1;
		flex-shrink: 1;

		form {
			display: flex;
			flex-direction: column;
			width: 100%;

			label {
				margin-bottom: 10px;
			}

			button {
				margin-bottom: 10px;
			}
		}
	}

	${Container} {
		flex: 1;
		min-width: 520px;
	}
`;

const BtnLink = styled.div<IBtnLink>`
	padding: 10px 0;
	display: flex;

	button {
		background-color: #90cdf4;
		border-radius: 10px;
		width: 100%;
		height: 50px;
		opacity: 0.5;
		transition: opacity 0.25s ease-in-out;

		&.isWakeup {
			opacity: ${(props) => (props.isChart ? '1' : '0.5')};
			pointer-events: ${(props) => (props.isChart ? 'none' : 'all')};
		}

		&.isSleep {
			opacity: ${(props) => (props.isChart ? '0.5' : '1')};
		}

		&:first-child {
			margin-right: 30px;
		}

		&:hover {
			opacity: 1;
		}
	}
`;

// 비율 바꾸기
const oneMinute = 1 / 60;

function Chart() {
	const [isChart, setIsChart] = useRecoilState(isChartAtom);
	const [wakeUpData, setWakeUpData] = useState<IChartData[]>([]);
	const navigate = useNavigate();
	const [isinputDisable, setIsinputDisable] = useState(false);
	const [isDark, setIsDark] = useRecoilState(themeState);
	const { id } = useParams();
	const { register, handleSubmit, setValue } = useForm();
	let date = new Date();
	const todayDate = date.getDate();
	console.log('테스트 wakeUpData: ', wakeUpData);
	// 변경사항을 localStorage에 저장하는 함수
	function sendToLocalStorage() {
		console.log('wakeUpData', wakeUpData);
		const response = localStorage.getItem('userWakeUpChartData');
		if (!response) {
			console.log('response에 데이터 없음!');
			return;
		} else {
			const storageData: IChartData[] = JSON.parse(response);
			storageData.splice(
				storageData.findIndex((el) => el?.date === id),
				1,
				wakeUpData[0]
			);
			console.log('기상 시간 변경 함수 실행!');
			localStorage.setItem('userWakeUpChartData', JSON.stringify(storageData));
		}
	}

	// wakeUpData가 변경될 때마다 localStorage에 저장해줌
	useEffect(() => {
		if (wakeUpData !== null || wakeUpData !== undefined) {
			if (wakeUpData.length !== 0) {
				sendToLocalStorage();
			}
		}
	}, [wakeUpData]);

	useEffect(() => {
		const response = localStorage.getItem('userWakeUpChartData');
		if (!response) {
			// 데이터 없는데 들어왔다면 메인 페이지로
			navigate('/');
		} else {
			const storageData: IChartData[] = JSON.parse(response);
			const storageFind = storageData.find((el) => el?.date === id);
			if (storageFind === undefined) return;
			setWakeUpData([storageFind]);
			console.log(
				'chat의 storageData: ',
				storageData.find((el) => el?.date === id)
			);
		}
	}, []);

	// input의 disabled 설정
	useEffect(() => {
		if (`${date.getFullYear()}${date.getMonth() + 1}` === id) {
			setIsinputDisable(false);
		} else {
			setIsinputDisable(true);
		}
	}, []);

	// 일어난 시간 설정
	const onValid = ({ wakeUpInput }: ISubmitProps) => {
		const stringTimeSplit = wakeUpInput
			.split(/\:/gi)
			.map((stringTime) => Number(stringTime));

		const numberTimeSplit = stringTimeSplit[0] + stringTimeSplit[1] * oneMinute;
		let newTimeTrack: string[];
		const isToady = wakeUpData[0]?.wakeUpDateTrack.findIndex(
			(el) => el === todayDate
		); // 새로운 값으로 바뀐 것에서 찾도록 해야 함
		if (wakeUpData[0]?.wakeUpDateTrack === undefined) return;
		const copyTime = [...wakeUpData[0]?.wakeUpTimeTrack];
		let copyDateArr;

		// const prevMonthLastDate = (new Date(date.getFullYear(), date.getMonth(), 0)).getDate() // 이전 달의 마지막 날짜
		// 날짜 지나면 추가하는 것 막아야 함 v
		// if() {} 데이터에 접근해서 date의 몇 월인지 가져오고 date.getMonth()와 다르면 alert로 "다음 달에서 작성해야 합니다." 라고 알림 띄우기 -> useParams의 202112와 현재가 다르면
		// SleepChart에서는 시작 날짜를 이전 달의마지막 일자로 넣어서 시작하도록 함 -> 30 1 2 3 이렇게 이전 달의 마지막 날을 시작으로
		// 데이터 받아온 후 findIndex -> find로 걸러서 값 수정해서 다시 넣는다.

		if (isToady === -1) {
			// 오늘 날짜가 없으면 날짜를 추가하고, 기상 시간도 함께 추가한다.
			newTimeTrack = [...copyTime, numberTimeSplit + ''];
			copyDateArr = [...wakeUpData[0]?.wakeUpDateTrack, todayDate];
			let newData2: IChartData = {
				...wakeUpData[0],
				wakeUpDateTrack: copyDateArr,
				wakeUpTimeTrack: newTimeTrack,
			};
			setWakeUpData([newData2]);
		} else {
			// 오늘 날짜가 있으면 날짜를 추가하지 않고 기상 시간만 수정한다.
			if (isToady === undefined) return;
			console.log('여기는 일어난 시간 수정하는 곳');
			copyTime[isToady] = numberTimeSplit + '';
			setWakeUpData([{ ...wakeUpData[0], wakeUpTimeTrack: copyTime }]);
		}
		setValue('wakeUpInput', '');
	};

	const deleteToday = () => {
		/* useState의 배열에 오늘 날짜(26)일이 없으면 삭제 못 함 당일만 삭제/수정 가능 */
		const isToday = wakeUpData[0]?.wakeUpDateTrack.findIndex(
			(el) => el === todayDate
		);
		console.log('isToday: ', isToday);
		if (isToday === -1) {
			alert('이전의 시간은 삭제할 수 없습니다.');
		} else {
			const copyWakeUpTime = [...wakeUpData[0]?.wakeUpTimeTrack];
			const copyDateArr = [...wakeUpData[0]?.wakeUpDateTrack];
			copyWakeUpTime.splice(isToday, 1);
			copyDateArr.splice(isToday, 1);
			setWakeUpData((old) => {
				return [
					{
						...old[0],
						wakeUpDateTrack: copyDateArr,
						wakeUpTimeTrack: copyWakeUpTime,
					},
				];
			});
		}
	};

	function timeConverter(prevTime: number) {
		let hours = Math.floor(prevTime);
		let minutes = ((prevTime - hours) * 60).toFixed(0);
		return `${hours < 10 ? `0${hours}` : hours}\:${
			Number(minutes) < 10 ? `0${minutes}` : minutes
		}`;
	}

	return (
		<>
			<PageWrapper>
				<FormWrapper>
					<form onSubmit={handleSubmit(onValid)}>
						<label htmlFor="wakeUp">시간 입력 (02:00 ~ 13:00)</label>
						<input
							{...register('wakeUpInput', { required: true })}
							autoComplete="off"
							type="time"
							id="wakeUp"
							min="02:00"
							max="13:00"
							disabled={isinputDisable}
						/>
						<button disabled={isinputDisable}>시간 입력/수정</button>
					</form>
					<DeleteButton
						onClick={deleteToday}
						type="button"
						disabled={isinputDisable}
					>
						오늘 기상 시간 삭제하기
					</DeleteButton>
					<div className="time-average">
						평균 기상 시간:{' '}
						{wakeUpData[0]?.wakeUpTimeTrack.length
							? averageTime(wakeUpData[0]?.wakeUpTimeTrack)
							: 'x'}
					</div>
				</FormWrapper>
				<Container>
					<BtnLink isChart={isChart}>
						<button className="isWakeup" onClick={() => setIsChart(true)}>
							기상 시간
						</button>
						<button className="isSleep" onClick={() => setIsChart(false)}>
							취침 시간
						</button>
					</BtnLink>
					{wakeUpData[0]?.wakeUpTimeTrack !== undefined ? (
						<ChartWrapper className="chartWrapper">
							<div className="wrp">
								<ApexChart
									type="line"
									series={[
										{
											name: '기상 시간',
											data: wakeUpData[0]?.wakeUpTimeTrack,
										},
									]}
									options={{
										chart: {
											height: 350,
											type: 'line',
											dropShadow: {
												enabled: true,
												color: '#000',
												top: 18,
												left: 7,
												blur: 10,
												opacity: 0.2,
											},
											toolbar: {
												show: false,
											},
										},
										colors: [isDark ? '#9C90E8' : '#4CC9FF'],
										dataLabels: {
											enabled: false,
											offsetX: -10,
											offsetY: -5,
											formatter: (value) => {
												return timeConverter(value as number);
											},
											background: {
												foreColor: 'white', // dataLabel의 text 색상
												borderWidth: 0,
												dropShadow: {
													enabled: false,
												},
											},
										},
										stroke: {
											curve: 'smooth',
										},
										title: {
											text: '기상 시간',
											align: 'center',
											style: {
												fontSize: '30px',
												color: chartTextColor(isDark),
											},
										},
										grid: {
											show: true,
											borderColor: chartGridColor(isDark),
											row: {
												colors: ['transparent', 'transparent'],
												opacity: 0.5,
											},
											xaxis: {
												lines: {
													show: true,
												},
											},
											yaxis: {
												lines: {
													show: false,
												},
											},
										},
										markers: {
											size: 1,
										},
										xaxis: {
											categories: wakeUpData[0]?.wakeUpDateTrack,
											title: {
												text: `${id?.substring(0, 4)}-${id?.substring(4)}`,
												style: {
													color: chartTextColor(isDark),
												},
											},
											labels: {
												style: {
													colors: chartTextColor(isDark),
												},
											},
											axisBorder: {
												show: true,
												color: chartGridColor(isDark),
											},
											axisTicks: {
												show: true,
												color: chartGridColor(isDark),
											},
										},
										yaxis: {
											tickAmount: 11,
											min: 2,
											max: 13,
											labels: {
												formatter: (value) => {
													return timeConverter(value);
												},
												style: {
													fontSize: '12px',
													colors: chartTextColor(isDark),
												},
											},
										},
										legend: {
											position: 'top',
											horizontalAlign: 'right',
											floating: true,
											offsetY: -25,
											offsetX: -5,
										},
										tooltip: {
											theme: isDark ? 'dark' : 'light',
											y: {
												formatter: (value) => {
													return timeConverter(value);
												},
											},
										},
									}}
								/>
							</div>
						</ChartWrapper>
					) : (
						<>Loading...</>
					)}
				</Container>
			</PageWrapper>
		</>
	);
}

export default React.memo(Chart);
