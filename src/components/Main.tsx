import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IChartData } from '../atoms';

const MainWrapper = styled.div`
	padding-top: 60px;
	height: 100vh;

	ul {
		display: flex;
		flex-direction: column;
	}

	li {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: ${(props) => props.theme.buttonColor};
		border-radius: 6px;
		margin: 6px;
		text-align: center;

		a {
			display: block;
			padding: 20px;
			width: 100%;
		}
	}
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
			console.log('처음 들어왔을 때');

			setChartDB([...newLocalData]);
			localStorage.setItem('userWakeUpChartData', JSON.stringify(newLocalData));
		} else {
			const storageData: IChartData[] = JSON.parse(response);
			const isCurrent = storageData.findIndex((el) => el?.date === currentDate); // 현재 Year&Month인지 확인

			if (isCurrent !== -1) {
				// 현재 날짜가 맞으면 아래를 실행
				setChartDB(storageData);
				console.log('데이터에 현재 날짜가 있을 때');
				console.log(currentDate);
				console.log(isCurrent);
			} else {
				// 11월 -> 12월로 바뀌면 새로운 date: Year&Month 를 추가
				console.log('새로운 월로 넘어왔을 때');
				let newDB;
				setChartDB((oldData) => {
					newDB = [...oldData, ...newLocalData];
					localStorage.setItem('userWakeUpChartData', JSON.stringify(newDB));
					return newDB;
				});
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
