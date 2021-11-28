import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
	ChartWrapper,
	Container,
	DeleteButton,
	FormWrapper,
	Title,
} from '../styles/chart-style';

interface ISubmitProps {
	wakeUpInput: string;
}

// 비율 바꾸기
const oneMinute = 1 / 60;

function Chart() {
	const [wakeUpTime, setWakeUpTime] = useState<string[]>([]);
	const [dateArr, setDateArr] = useState<number[]>([3]);

	const { register, handleSubmit, setValue } = useForm();
	let date = new Date();
	const todayDate = date.getDate();

	// 일어난 시간 설정
	const onValid = ({ wakeUpInput }: ISubmitProps) => {
		const stringTimeSplit = wakeUpInput
			.split(/\:/gi)
			.map((stringTime) => Number(stringTime));

		const numberTimeSplit = stringTimeSplit[0] + stringTimeSplit[1] * oneMinute;
		let newData;
		const isToady = dateArr.findIndex((el) => el === todayDate);
		const copyTime = [...wakeUpTime];
		let copyDateArr;

		if (isToady === -1) {
			setDateArr((oldArr) => {
				copyDateArr = [...oldArr, todayDate];
				return copyDateArr;
			});
			console.log('여기는 오늘 데이터 없을 때 추가하는 곳');

			newData = [...copyTime, numberTimeSplit.toFixed(1) + ''];
			setWakeUpTime(newData);
		} else {
			console.log('여기는 일어난 시간 수정하는 곳');
			copyDateArr = [...dateArr]; // 계속 copyDateArr가 없다고 뜨거나 isToday가 -1일 때만 줘서 이상하게 동작했음
			copyTime[isToady] = numberTimeSplit.toFixed(1) + '';
			newData = copyTime;
			setWakeUpTime(copyTime);
		}

		setValue('wakeUpInput', '');
		localStorage.setItem('wakeUpTimeTrack', JSON.stringify(newData));
		localStorage.setItem('wakeUpDateTrack', JSON.stringify(copyDateArr));
	};

	useEffect(() => {
		const storageData = localStorage.getItem('wakeUpTimeTrack');
		const storageTime = localStorage.getItem('wakeUpDateTrack');
		if (!storageData || !storageTime) return;
		setWakeUpTime(JSON.parse(storageData));
		setDateArr(JSON.parse(storageTime));
	}, []);

	const deleteToday = () => {
		/* useState의 배열에 오늘 날짜(26)일이 없으면 삭제 못 함 당일만 삭제/수정 가능 */
		const isToday = dateArr.findIndex((el) => el === todayDate);
		if (isToday === -1) {
			alert('이전의 시간은 삭제할 수 없습니다.');
		} else {
			const copyWakeUpTime = [...wakeUpTime];
			const copyDateArr = [...dateArr];
			copyWakeUpTime.splice(isToday, 1);
			copyDateArr.splice(isToday, 1);
			setWakeUpTime(copyWakeUpTime);
			setDateArr(copyDateArr);
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
						<label htmlFor="wakeUp">시간 입력 (00:00 ~ 13:00)</label>
						<input
							{...register('wakeUpInput', { required: true })}
							autoComplete="off"
							type="time"
							id="wakeUp"
							min="00:00"
							max="13:00"
						/>
						<button>제출</button>
					</form>
					<DeleteButton onClick={deleteToday} type="button">
						오늘 일어난 시간 삭제하기
					</DeleteButton>
				</FormWrapper>
				<ChartWrapper>
					<ApexChart
						type="line"
						series={[
							{
								name: '기상 시간',
								data: wakeUpTime,
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
								text: '기상 시간',
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
								tickAmount: 13,
								min: 0,
								max: 13,
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

export default Chart;
