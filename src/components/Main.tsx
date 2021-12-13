import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IChartData } from '../atoms';

const MainWrapper = styled.div`
	padding-top: 60px;
	height: 100vh;
`;

const leftAside = styled.aside``;

const MainSection = styled.main``;

function Main() {
	// const [chartDB, setChartDB] = useRecoilState<IChartData[]>(chartData);
	const [chartDB, setChartDB] = useState<IChartData[]>([]);
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
			<MainWrapper>
				<nav>
					<ul>
						{chartDB.map((el, index) => (
							<li key={index}>
								<Link to={`/${el.date}`}>
									{el?.date.substring(0, 4)}-{el?.date.substring(4)}월
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</MainWrapper>
		</>
	);
}

export default Main;
