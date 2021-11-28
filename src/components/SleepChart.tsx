import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
	ChartWrapper,
	Container,
	DeleteButton,
	FormWrapper,
	sleepAverageTime,
	Title,
} from '../styles/chart-style';

interface ISubmitProps {
	sleepInput: string;
}

// 비율 바꾸기
const oneMinute = 1 / 60;

function SleepChart() {
	const [sleepTime, setSleepTime] = useState<string[]>([]);
	const [dateArr, setDateArr] = useState<number[]>([3]);

	const { register, handleSubmit, setValue } = useForm();
	let date = new Date();
	const todayDate = date.getDate();

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
		const isToady = dateArr.findIndex((el) => el === todayDate - 1); // 일어난 날짜가 28일이면 27일에 잠을 자고 일어난 것이니까 하루 뺐음
		const copyTime = [...sleepTime];
		let copyDateArr;

		if (isToady === -1) {
			setDateArr((oldArr) => {
				copyDateArr = [...oldArr, todayDate - 1];
				return copyDateArr;
			});
			console.log('여기는 오늘 데이터 없을 때 추가하는 곳');

			newData = [...copyTime, numberTimeSplit + ''];
			setSleepTime(newData);
		} else {
			console.log('여기는 일어난 시간 수정하는 곳');
			copyDateArr = [...dateArr]; // 계속 copyDateArr가 없다고 뜨거나 isToday가 -1일 때만 줘서 이상하게 동작했음
			copyTime[isToady] = numberTimeSplit + '';
			newData = copyTime;
			if (newData) {
			}
			setSleepTime(copyTime);
			console.log(newData);
		}

		setValue('sleepInput', '');
		localStorage.setItem('sleepTimeTrack', JSON.stringify(newData));
		localStorage.setItem('sleepDateTrack', JSON.stringify(copyDateArr));
	};

	useEffect(() => {
		const storageTimeTrack = localStorage.getItem('sleepTimeTrack');
		const storageDateTrack = localStorage.getItem('sleepDateTrack');
		if (!storageTimeTrack || !storageDateTrack) return;
		setSleepTime(JSON.parse(storageTimeTrack));
		setDateArr(JSON.parse(storageDateTrack));
	}, []);

	const deleteToday = () => {
		/* useState의 배열에 오늘 날짜(26)일이 없으면 삭제 못 함 당일만 삭제/수정 가능 */
		const isToday = dateArr.findIndex((el) => el === todayDate - 1);
		if (isToday === -1) {
			alert('이전의 시간은 삭제할 수 없습니다.');
		} else {
			const copySleepTime = [...sleepTime];
			const copyDateArr = [...dateArr];
			copySleepTime.splice(isToday, 1);
			copyDateArr.splice(isToday, 1);
			setSleepTime(copySleepTime);
			setDateArr(copyDateArr);
			localStorage.setItem('sleepTimeTrack', JSON.stringify(copySleepTime));
			localStorage.setItem('sleepDateTrack', JSON.stringify(copyDateArr));
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
			<Title>
				취침 시간 그래프
				{`(${date.getFullYear() + ' - ' + (date.getMonth() + 1)})`}
			</Title>
			<Container>
				<FormWrapper>
					<form onSubmit={handleSubmit(onValid)}>
						<label htmlFor="sleep">시간 입력 (19:00 ~ 06:00)</label>
						<input
							{...register('sleepInput', { required: true })}
							autoComplete="off"
							type="time"
							id="sleep"
							min="19:00"
							max="06:00"
						/>
						<button>제출</button>
					</form>
					<DeleteButton onClick={deleteToday} type="button">
						오늘 취침 시간 삭제하기
					</DeleteButton>
					<div>
						평균 취침 시간:{' '}
						{sleepTime.length ? sleepAverageTime(sleepTime) : 'x'}
					</div>
				</FormWrapper>
				<ChartWrapper>
					<ApexChart
						type="line"
						series={[
							{
								name: '취침 시간',
								data: sleepTime,
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
							colors: ['#4CC9FF', '#545454'], // 그래프 색 바꾸는 곳
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
								align: 'left',
								style: {
									fontSize: '50px',
								},
							},
							grid: {
								show: true,
								borderColor: '#e7e7e775',
								row: {
									colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
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
								categories: dateArr,
								title: {
									text: '2021 - 11',
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
								y: {
									formatter: (value) => {
										return timeConverter(value);
									},
								},
							},
						}}
					/>
				</ChartWrapper>
			</Container>
		</>
	);
}

export default SleepChart;
