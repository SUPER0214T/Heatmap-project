import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

const Title = styled.div`
	padding: 10px;
	font-size: 2rem;
	font-weight: bold;
	text-align: center;
`;

const DeleteButton = styled.button`
	cursor: pointer;
	background-color: tomato;
	color: white;
	font-weight: bold;
	border-radius: 5px;
	padding: 5px;
`;

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
		return `${hours < 10 ? `0${hours}` : hours} \: ${
			Number(minutes) < 10 ? `0${minutes}` : minutes
		}`;
	}

	/* 
    1. 오늘 일어난 시간 수정하기 v
    2. 60분을 1비율로 바꾸기 v
    3. 제출 눌렀는데 아무것도 없으면 시간 선택하라고 register에 messagge custom 작성하기
    4. 월 별로 나타내기 -> React-Router 사용해서 각 페이지 나눌 것임 -> 이것도 new Date로 month가져와서 페이지 나누면 됨
    5. 잠이 든 시간도 나타낼 것임

    6. formatter로 그래프 hover했을 때 tooltip 나타나는거 시간으로 바꾸기 -> formatter이용
  */

	return (
		<>
			<Title>Chart Page</Title>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register('wakeUpInput', { required: true })}
					autoComplete="off"
					type="time"
					id="wakeUp"
				/>
				<label htmlFor="wakeUp">시간 입력하기</label>
				<button>제출</button>
			</form>
			<DeleteButton onClick={deleteToday} type="button">
				오늘 일어난 시간 삭제하기
			</DeleteButton>
			<ApexChart
				type="line"
				series={[
					{
						name: '일어난 시간',
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
					colors: ['#0c9df1', '#545454'],
					dataLabels: {
						enabled: true,
					},
					stroke: {
						curve: 'smooth',
					},
					title: {
						text: '일어난 시간 그래프',
						align: 'left',
					},
					grid: {
						borderColor: '#e7e7e7',
						row: {
							colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 1,
					},
					xaxis: {
						categories: dateArr,
						title: {
							text: '날짜',
						},
					},
					yaxis: {
						tickAmount: 6,
						min: 0,
						max: 24,
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
							}, // 들어온 값(8.5)을 8:30으로 바꾸는 함수 호출
						},
					},
				}}
			/>
		</>
	);
}

export default Chart;
