import { motion, useViewportScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { IChartData, themeState } from '../atoms';

type HeaderProps = {
	isScroll: boolean;
};

const HeaderSection = styled.header<HeaderProps>`
	padding: 8px;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	background-color: ${(props) => props.theme.bgColor};
	width: 100%;
	height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: box-shadow 0.2s ease-in-out;
	opacity: 0.97;
	border-bottom: ${(props) =>
		props.isScroll ? 'none' : `1px solid ${props.theme.borderColor}`};
	box-shadow: ${(props) =>
		props.isScroll ? '0px 2px 4px rgb(0 0 0 / 10%)' : 'none'};
`;

const ToggleButton = styled(motion.div)<{ isToggle: boolean }>`
	width: 50px;
	height: 24px;
	background-color: rgba(0, 0, 0, 0.185);
	display: flex;
	justify-content: ${(props) => (props.isToggle ? 'flex-start' : 'flex-end')};
	align-items: center;
	border-radius: 25px;
	padding: 5px;
	cursor: pointer;

	.handle {
		width: 20px;
		height: 20px;
		background-color: white;
		border-radius: 20px;
	}
`;

function Header() {
	const { scrollYProgress } = useViewportScroll();
	const [isDark, setIsDark] = useRecoilState(themeState);
	const [isScroll, setIsScroll] = useState<boolean>(false);

	scrollYProgress.onChange(() =>
		scrollYProgress.get() === 0 ? setIsScroll(false) : setIsScroll(true)
	);

	const [isOn, setIsOn] = useState(false);
	const toggleSwitch = () => {
		setIsOn(!isOn);
		setIsDark((prev) => !prev);
	};

	//
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
			<HeaderSection isScroll={isScroll}>
				<Link to="/">메인 페이지</Link>
				{chartDB.map((el, index) => (
					<Link key={index} to={`/${el?.date}`}>
						{el?.date.substring(0, 4)}년도 {el?.date.substring(4)}월 그래프
					</Link>
				))}
				<ToggleButton
					className="switch"
					isToggle={isOn}
					onClick={toggleSwitch}
					layout
				>
					<motion.div layout className="handle" />
				</ToggleButton>
			</HeaderSection>
		</>
	);
}

export default Header;
