import styled from 'styled-components';

export const Title = styled.div`
	padding: 10px;
	font-size: 2rem;
	font-weight: bold;
	text-align: center;
`;

export const ChartWrapper = styled.div`
	min-width: 600px;
	max-width: 1200px;
	margin: 0 auto;
`;

export const FormWrapper = styled.div`
	min-width: 200px;
`;

export const Container = styled.div`
	display: flex;

	${FormWrapper} {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;

		form {
			display: flex;
			flex-direction: column;

			label {
				margin-bottom: 10px;
			}

			button {
				margin-bottom: 10px;
			}
		}
	}

	${ChartWrapper} {
		flex: 1;
	}
`;

export const DeleteButton = styled.button`
	cursor: pointer;
	background-color: tomato;
	color: white;
	font-weight: bold;
	border-radius: 5px;
	padding: 5px;
`;

export function averageTime(timeArray: string[]) {
	let allTimes = 0;
	timeArray.map((time) => Number(time)).map((time) => (allTimes += time));
	const average = allTimes / timeArray.length;

	let hours = Math.floor(average);
	let minutes = ((average - hours) * 60).toFixed(0);
	return `${hours < 10 ? `0${hours}` : hours}\:${
		Number(minutes) < 10 ? `0${minutes}` : minutes
	}`;
}

export function sleepAverageTime(timeArray: string[]) {
	let allTimes = 0;
	timeArray.map((time) => Number(time)).map((time) => (allTimes += time));
	const average = allTimes / timeArray.length;

	let hours = Math.floor(average);
	let minutes = ((average - hours) * 60).toFixed(0);
	return `${hours >= 24 ? `0${hours - 24}` : hours}\:${
		Number(minutes) < 10 ? `0${minutes}` : minutes
	}`;
}

export function chartTextColor(isDark: boolean): string {
	return isDark ? '#C9D1D9' : '#0D1117';
}

export function chartGridColor(isDark: boolean): string {
	return isDark ? '#c9d1d940' : '#e7e7e775';
}
