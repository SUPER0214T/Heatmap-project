import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { chartData, IChartData } from '../atoms';

function Main() {
	const [chartDB, setChartDB] = useRecoilState<IChartData[]>(chartData);
	let date = new Date();
	const currentDate = `${date.getFullYear()}${
		date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
	}`;

	const newLocalData: IChartData[] = [
		{
			date: currentDate,
			wakeUpDateTrack: [],
			wakeUpTimeTrack: [],
			sleepDateTrack: [],
			sleepTimeTrack: [],
		},
	];

	useEffect(() => {
		const response = localStorage.getItem('userWakeUpChartData');

		if (!response) {
			// 처음 들어왔을 때 바로 아래 실행
			setChartDB([...newLocalData]);
			localStorage.setItem('userWakeUpChartData', JSON.stringify(newLocalData));
		} else {
			const storageData: IChartData[] = JSON.parse(response);
			const isCurrent = storageData.findIndex((el) => el?.date === currentDate); // 현재 Year&Month인지 확인

			if (isCurrent !== -1) {
				setChartDB(storageData);
				console.log('여기는 App의 isCurrent');
			} else {
				// 11월 -> 12월로 바뀌면 새로운 date: Year&Month 를 추가
				let newDB;
				setChartDB((oldData) => {
					newDB = [...oldData, ...newLocalData];
					return newDB;
				});
				localStorage.setItem('userWakeUpChartData', JSON.stringify(newDB));
			}
		}
	}, []);

	return (
		<>
			<div style={{ background: 'red', color: 'white' }}>여기는 main</div>
		</>
	);
}

export default Main;
