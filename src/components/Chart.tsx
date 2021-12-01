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
import { chartData, IChartData, themeState } from '../atoms';
import { useNavigate, useParams } from 'react-router';

interface ISubmitProps {
	wakeUpInput: string;
}

// 비율 바꾸기
const oneMinute = 1 / 60;

function Chart() {
	const [chartDB, setChartDB] = useRecoilState<IChartData[]>(chartData);
	const [wakeUpData, setWakeUpData] = useState<IChartData>();
	const navigate = useNavigate();

	const [isDark, setIsDark] = useRecoilState(themeState);
	const { id } = useParams();
	const { register, handleSubmit, setValue } = useForm();
	let date = new Date();

	console.log(wakeUpData?.wakeUpDateTrack);
	const todayDate = date.getDate();

	useEffect(() => {
		const currentMonthData = chartDB.find((el) => el.date === id);
		if (currentMonthData === undefined) {
			const response = localStorage.getItem('userWakeUpChartData');
			if (!response) {
				// 데이터 없는데 들어왔다면 메인 페이지로
				navigate('/');
			} else {
				const storageData: IChartData[] = JSON.parse(response);
				setWakeUpData(storageData.find((el) => el.date === id));
				setChartDB(storageData);
			}
		} else {
			setWakeUpData(currentMonthData);
		}
	}, []);

	useEffect(() => {
		// chart 페이지 나가면 localStorage에 변경된 모든 데이터 저장하면서 나가기
		if (wakeUpData === undefined) return;
		const copyChartDB = [...chartDB];
		copyChartDB.splice(
			chartDB.findIndex((el) => el.date === id),
			1,
			wakeUpData
		);
		console.log('기상 시간 변경!');
		localStorage.setItem('userWakeUpChartData', JSON.stringify(copyChartDB));
	}, [wakeUpData]);

	// 일어난 시간 설정
	const onValid = ({ wakeUpInput }: ISubmitProps) => {
		const stringTimeSplit = wakeUpInput
			.split(/\:/gi)
			.map((stringTime) => Number(stringTime));

		const numberTimeSplit = stringTimeSplit[0] + stringTimeSplit[1] * oneMinute;
		let newTimeTrack: string[];
		const isToady = wakeUpData?.wakeUpDateTrack.findIndex(
			(el) => el === todayDate
		); // 새로운 값으로 바뀐 것에서 찾도록 해야 함
		if (wakeUpData?.wakeUpDateTrack === undefined) return;
		const copyTime = [...wakeUpData?.wakeUpTimeTrack];
		let copyDateArr;

		// const prevMonthLastDate = (new Date(date.getFullYear(), date.getMonth(), 0)).getDate() // 이전 달의 마지막 날짜
		// 날짜 지나면 추가하는 것 막아야 함
		// if() {} 데이터에 접근해서 date의 몇 월인지 가져오고 date.getMonth()와 다르면 alert로 "다음 달에서 작성해야 합니다." 라고 알림 띄우기 -> useParams의 202112와 현재가 다르면
		// SleepChart에서는 시작 날짜를 이전 달의마지막 일자로 넣어서 시작하도록 함 -> 30 1 2 3 이렇게 이전 달의 마지막 날을 시작으로
		// 데이터 받아온 후 findIndex -> find로 걸러서 값 수정해서 다시 넣는다.

		if (isToady === -1) {
			// 오늘 날짜가 없으면 날짜를 추가하고, 기상 시간도 함께 추가한다.
			newTimeTrack = [...copyTime, numberTimeSplit + ''];
			setWakeUpData(() => {
				copyDateArr = [...wakeUpData?.wakeUpDateTrack, todayDate];
				return {
					...wakeUpData,
					wakeUpDateTrack: copyDateArr,
					wakeUpTimeTrack: newTimeTrack,
				};
			});
		} else {
			// 오늘 날짜가 있으면 날짜를 추가하지 않고 기상 시간만 수정한다.
			if (isToady === undefined) return;
			console.log('여기는 일어난 시간 수정하는 곳');
			copyTime[isToady] = numberTimeSplit + '';
			setWakeUpData({ ...wakeUpData, wakeUpTimeTrack: copyTime });
		}
		setValue('wakeUpInput', '');
	};

	const deleteToday = () => {
		/* useState의 배열에 오늘 날짜(26)일이 없으면 삭제 못 함 당일만 삭제/수정 가능 */
		const isToday = wakeUpData?.wakeUpDateTrack.findIndex(
			(el) => el === todayDate
		);
		if (isToday === -1) {
			alert('이전의 시간은 삭제할 수 없습니다.');
		} else {
			if (
				wakeUpData?.wakeUpTimeTrack === undefined ||
				wakeUpData?.wakeUpDateTrack === undefined ||
				isToday === undefined
			)
				return;
			const copyWakeUpTime = [...wakeUpData?.wakeUpTimeTrack];
			const copyDateArr = [...wakeUpData?.wakeUpDateTrack];
			copyWakeUpTime.splice(isToday, 1);
			copyDateArr.splice(isToday, 1);
			setWakeUpData(() => {
				return {
					...wakeUpData,
					wakeUpDateTrack: copyDateArr,
					wakeUpTimeTrack: copyWakeUpTime,
				};
			});
			localStorage.setItem('wakeUpTimeTrack', JSON.stringify(copyWakeUpTime));
			localStorage.setItem('wakeUpDateTrack', JSON.stringify(copyDateArr));
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
			<Title>
				기상 시간 그래프
				{`(${date.getFullYear() + ' - ' + (date.getMonth() + 1)})`}
			</Title>
			<Container>
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
						/>
						<button>제출</button>
					</form>
					<DeleteButton onClick={deleteToday} type="button">
						오늘 기상 시간 삭제하기
					</DeleteButton>
					<div>
						평균 기상 시간:{' '}
						{wakeUpData?.wakeUpTimeTrack.length
							? averageTime(wakeUpData?.wakeUpTimeTrack)
							: 'x'}
					</div>
				</FormWrapper>
				{wakeUpData?.wakeUpTimeTrack !== undefined ? (
					<ChartWrapper>
						<ApexChart
							type="line"
							series={[
								{
									name: '기상 시간',
									data: wakeUpData?.wakeUpTimeTrack,
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
									align: 'left',
									style: {
										fontSize: '50px',
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
									categories: wakeUpData?.wakeUpDateTrack,
									title: {
										text: '2021 - 11',
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
					</ChartWrapper>
				) : (
					<>Loading...</>
				)}
			</Container>
		</>
	);
}

export default React.memo(Chart);
