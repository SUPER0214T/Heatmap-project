import styled from 'styled-components';

export const Title = styled.div`
	padding: 10px;
	font-size: 2rem;
	font-weight: bold;
	/* text-align: center; */
`;

export const ChartWrapper = styled.div`
	/* flex: 1; */
	/* min-width: 600px; */
	/* max-width: 1200px; */
	/* margin: 0 auto; */
	/* border: 1px solid #eee; */
	/* border-radius: 10px; */
	/* box-shadow: 1px 1px #eee; */
	/* align-self: center; */

	.wrp {
		/* min-width: 600px;
		max-width: 1200px; */
		border: 1px solid ${(props) => props.theme.borderColor};
		border-radius: 10px;
		padding: 10px;
		margin: 0 auto;
		box-shadow: rgb(0 0 0 / 4%) 0px 2px 10px 0px;
	}
`;

export const FormWrapper = styled.div`
	padding: 8px;
	min-width: 232px;
	max-width: 300px;
	flex-grow: 1;
	flex-shrink: 1;
	height: 100%;
	min-width: 200px;
	border-right: 1px solid ${(props) => props.theme.borderColor}; //#dadde1 #606770

	form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	label {
		margin-bottom: 10px;
	}

	.inputSection {
		display: inline-flex;
		align-items: stretch;
		margin-bottom: 16px;

		button {
			flex-grow: 1;
			border-radius: 16px;
			transition: opacity 0.2s ease-in-out;

			&:hover {
				opacity: 0.5;
			}
		}
	}

	.time-input {
		display: block;
		min-width: 170px;
		height: auto;
		background-color: transparent;

		& {
			border: none;
			color: #2a2c2d;
			font-size: 14px;
			font-family: helvetica;
		}
		&::-webkit-datetime-edit-fields-wrapper {
			display: flex;
		}

		&::-webkit-datetime-edit-text {
			padding: 19px 4px;
		}

		&::-webkit-datetime-edit-hour-field {
			background-color: #f2f4f5;
			border-radius: 15%;
			padding: 19px 13px;
		}

		&::-webkit-datetime-edit-minute-field {
			background-color: #f2f4f5;
			border-radius: 15%;
			padding: 19px 13px;
		}

		&::-webkit-datetime-edit-ampm-field {
			background-color: #7155d3;
			border-radius: 15%;
			color: #fff;
			padding: 19px 13px;
		}

		&::-webkit-clear-button {
			display: none;
		}

		&::-webkit-inner-spin-button {
			display: none;
		}

		&::-webkit-calendar-picker-indicator {
			background: transparent;
			left: -10px;
			color: transparent;
			cursor: pointer;
			height: 56px;
			width: 170px;
			position: absolute;
		}

		&:focus {
			outline: none;
		}
	}
`;

export const Container = styled.div`
	padding: 15px;
	display: flex;
	min-width: 600px;
	max-width: 1200px;
	margin: 0 auto;
	flex-direction: column;
	overflow-y: scroll;

	&::-webkit-scrollbar {
		display: none;
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
	width: 100%;
	margin-bottom: 8px;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
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
