import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { chartData, IChartData, themeState } from './atoms';
import Chart from './components/Chart';
import SleepChart from './components/SleepChart';
import { darkTheme, lightTheme } from './theme';
import { Routes, Route, Link } from 'react-router-dom';
import Main from './components/Main';

const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button {
    outline: none;
    border: none;
    cursor: pointer;
  }
  body {
    /* transition: background-color .35s ease-in-out, color .35s ease-in-out; */
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

// 버튼이 이상하게 애니메이션 되니까 useState로 보였다 안보였다 + layoutId
const ToggleButton = styled(motion.div)<{ isToggle: boolean }>`
	width: 80px;
	height: 50px;
	background-color: rgba(0, 0, 0, 0.185);
	display: flex;
	justify-content: ${(props) => (props.isToggle ? 'flex-start' : 'flex-end')};
	border-radius: 25px;
	padding: 5px;
	cursor: pointer;

	.handle {
		width: 40px;
		height: 40px;
		background-color: white;
		border-radius: 20px;
	}
`;

function App() {
	const [isDark, setIsDark] = useRecoilState(themeState);
	const [chartDB, setChartDB] = useRecoilState<IChartData[]>(chartData);
	let date = new Date();

	const [isOn, setIsOn] = useState(false);
	const toggleSwitch = () => {
		setIsOn(!isOn);
		setIsDark((prev) => !prev);
	};

	return (
		<>
			<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
				<ToggleButton className="switch" isToggle={isOn} onClick={toggleSwitch}>
					<motion.div className="handle" />
				</ToggleButton>
				<button
					onClick={() => {
						setIsDark((prev) => !prev);
						console.log(chartDB);
					}}
				>
					Theme toggle
				</button>
				<GlobalStyle />
				<Link to="/">메인 페이지/</Link>
				{chartDB.map((el) => (
					<Link to={`/${el?.date}`}>
						{el?.date.substring(0, 4)}년도 {el?.date.substring(4)}월 그래프
					</Link>
				))}

				<Routes>
					<Route
						path="/:id"
						element={
							<>
								<Chart />
								<hr />
								<SleepChart />
							</>
						}
					/>
					<Route path="/" element={<Main />} />
				</Routes>
			</ThemeProvider>
		</>
	);
}

export default App;
