import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
	chartGridColor,
	chartTextColor,
	ChartWrapper,
	Container,
	DeleteButton,
	FormWrapper,
	sleepAverageTime,
} from '../styles/chart-style';
import { useRecoilState } from 'recoil';
import { IChartData, isChartAtom, themeState } from '../atoms';
import { useNavigate, useParams } from 'react-router';
import { IBtnLink } from './Charts';

interface ISubmitProps {
	sleepInput: string;
}

const PageWrapper = styled.div`
	display: flex;
	height: 100vh;
	padding-top: 60px;

	${Container} {
		flex: 1;
		min-width: 520px;
	}
`;

const BtnLink = styled.div<IBtnLink>`
	display: flex;
	margin-bottom: 20px;

	button {
		background-color: #90cdf4;
		border-radius: 10px;
		width: 100%;
		height: 50px;
		opacity: 0.5;
		transition: opacity 0.25s ease-in-out;
		transition: opacity 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
		box-shadow: 10px 10px 14px 1px rgb(0 0 0 / 10%);

		&.isWakeup {
			opacity: ${(props) => (props.isChart ? '1' : '0.7')};
			pointer-events: ${(props) => (props.isChart ? 'none' : 'all')};
			box-shadow: ${(props) =>
				props.isChart ? 'none' : '10px 10px 14px 1px rgb(0 0 0 / 10%)'};
		}
		&.isSleep {
			opacity: ${(props) => (props.isChart ? '0.7' : '1')};
			pointer-events: ${(props) => (props.isChart ? 'all' : 'none')};
			box-shadow: ${(props) =>
				props.isChart ? '10px 10px 14px 1px rgb(0 0 0 / 10%)' : 'none'};
		}

		&:first-child {
			margin-right: 30px;
		}

		&:hover {
			opacity: 1;
			box-shadow: none;
		}
	}
`;

// 비율 바꾸기
const oneMinute = 1 / 60;

function SleepChart() {
	const [sleepData, setSleepData] = useState<IChartData[]>([]);
	const [isChart, setIsChart] = useRecoilState(isChartAtom);

	const [isDark, setIsDark] = useRecoilState(themeState);
	const { id } = useParams();
	const { register, handleSubmit, setValue } = useForm();
	let date = new Date();
	const todayDate = date.getDate();
	const navigate = useNavigate();
	const [isinputDisable, setIsinputDisable] = useState(false);

	// 변경사항을 localStorage에 저장하는 함수
	function sendToLocalStorage() {
		console.log('sleepData', sleepData);
		const response = localStorage.getItem('userWakeUpChartData');
		if (!response) {
			console.log('response에 데이터 없음!');
			return;
		} else {
			const storageData: IChartData[] = JSON.parse(response);
			storageData.splice(
				storageData.findIndex((el) => el?.date === id),
				1,
				sleepData[0]
			);
			console.log('기상 시간 변경 함수 실행!');
			localStorage.setItem('userWakeUpChartData', JSON.stringify(storageData));
		}
	}

	// sleepData가 변경될 때마다 localStorage에 저장해줌
	useEffect(() => {
		if (sleepData !== null || sleepData !== undefined) {
			if (sleepData.length !== 0) {
				sendToLocalStorage();
			}
		}
	}, [sleepData]);

	useEffect(() => {
		const response = localStorage.getItem('userWakeUpChartData');
		if (!response) {
			// 데이터 없는데 들어왔다면 메인 페이지로
			navigate('/');
		} else {
			const storageData: IChartData[] = JSON.parse(response);
			const storageFind = storageData.find((el) => el?.date === id);
			if (storageFind === undefined) return;
			setSleepData([storageFind]);
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
	const onValid = ({ sleepInput }: ISubmitProps) => {
		const stringTimeSplit = sleepInput
			.split(/\:/gi)
			.map((stringTime) => Number(stringTime));

		if (stringTimeSplit[0] <= 6) {
			stringTimeSplit[0] += 24;
		}
		const numberTimeSplit = stringTimeSplit[0] + stringTimeSplit[1] * oneMinute;
		let newData: string[];
		let isToday = sleepData[0].sleepDateTrack.findIndex(
			(el) => el === todayDate - 1
		); // 일어난 날짜가 28일이면 27일에 잠을 자고 일어난 것이니까 하루 뺐음

		// date가 빈 배열일 때는 isToday = 0일 필요가 없음 ->
		if (todayDate - 1 === 0) {
			// 새로운 달 이니까 배열의 첫 번째로 이전 달의 마지막 날짜가 들어가야 한다. -> 0번째 index에 이전 달의 마지막 날짜를 넣으면 됨
			if (sleepData[0].sleepDateTrack.length === 1) {
				isToday = 0;
			}
		}

		const copyTime = [...sleepData[0].sleepTimeTrack];

		if (isToday === -1) {
			if (todayDate - 1 === 0) {
				// 오늘이 1일 이라면 이전 달의 마지막 날을 date 배열로 추가한다. -> 30 1 2 3 이렇게 이전 달의 마지막 날부터 시작하는 형식임
				const prevMonthLastDate = new Date(
					date.getFullYear(),
					date.getMonth(),
					0
				).getDate();
				const newTimeTrack = [...copyTime, numberTimeSplit + ''];
				const copyDateArr = [
					...sleepData[0]?.sleepDateTrack,
					prevMonthLastDate,
				];
				let newData2: IChartData = {
					...sleepData[0],
					sleepDateTrack: copyDateArr,
					sleepTimeTrack: newTimeTrack,
				};
				setSleepData([newData2]);
			} else {
				const newTimeTrack = [...copyTime, numberTimeSplit + ''];
				const copyDateArr = [...sleepData[0]?.sleepDateTrack, todayDate - 1];
				let newData2: IChartData = {
					...sleepData[0],
					sleepDateTrack: copyDateArr,
					sleepTimeTrack: newTimeTrack,
				};
				setSleepData([newData2]);
			}
			// newData = [...copyTime, numberTimeSplit + ''];
			// setSleepTime(newData);
		} else {
			copyTime[isToday] = numberTimeSplit + ''; // 1일에는 이전 달의 마지막 날짜가 추가되어서 수정하려고 할 때 isToady가 계속 현재 날짜 1일이 없다고 나와서 계속 데이터 추가됨
			setSleepData([{ ...sleepData[0], sleepTimeTrack: copyTime }]);
		}
		setValue('sleepInput', '');
	};

	const deleteToday = () => {
		/* useState의 배열에 오늘 날짜(26)일이 없으면 삭제 못 함 당일만 삭제/수정 가능 */
		const isToday = sleepData[0].sleepDateTrack.findIndex(
			(el) => el === todayDate - 1
		);
		if (isToday === -1) {
			alert('이전의 시간은 삭제할 수 없습니다.');
		} else {
			const copySleepTime = [...sleepData[0].sleepTimeTrack];
			const copyDateArr = [...sleepData[0].sleepDateTrack];
			copySleepTime.splice(isToday, 1);
			copyDateArr.splice(isToday, 1);
			setSleepData((old) => {
				return [
					{
						...old[0],
						sleepDateTrack: copyDateArr,
						sleepTimeTrack: copySleepTime,
					},
				];
			});
			// 00:00 ~ 06:00
		}
	};

	function timeConverter(prevTime: number) {
		let hours = Math.floor(prevTime);
		let minutes = ((prevTime - hours) * 60).toFixed(0);
		return `${hours >= 24 ? `0${hours - 24}` : hours}\:${
			Number(minutes) < 10 ? `0${minutes}` : minutes
		}`;
	}

	return (
		<>
			<PageWrapper>
				<FormWrapper>
					<form onSubmit={handleSubmit(onValid)}>
						<label htmlFor="sleep">시간 입력 (19:00 ~ 06:00)</label>
						<div className="inputSection">
							<input
								{...register('sleepInput', { required: true })}
								className="time-input"
								autoComplete="off"
								type="time"
								id="sleep"
								min="19:00"
								max="06:00"
								disabled={isinputDisable}
							/>
							<button disabled={isinputDisable}>입력/수정</button>
						</div>
					</form>
					<DeleteButton
						onClick={deleteToday}
						type="button"
						disabled={isinputDisable}
					>
						오늘 취침 시간 삭제하기
					</DeleteButton>
					<div className="time-average">
						평균 취침 시간:{' '}
						{sleepData[0]?.sleepTimeTrack.length
							? sleepAverageTime(sleepData[0]?.sleepTimeTrack)
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
					{sleepData[0]?.wakeUpTimeTrack !== undefined ? (
						<ChartWrapper className="chartWrapper">
							<div className="wrp">
								<ApexChart
									type="line"
									series={[
										{
											name: '취침 시간',
											data: sleepData[0]?.sleepTimeTrack,
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
										colors: [isDark ? '#9C90E8' : '#4CC9FF'], // 그래프 색 바꾸는 곳
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
											text: '취침 시간',
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
											categories: sleepData[0]?.sleepDateTrack,
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
											min: 19,
											max: 30,
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

export default SleepChart;
