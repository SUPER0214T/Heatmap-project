import Chart from '../components/Chart';
import SleepChart from './SleepChart';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { isChartAtom } from '../atoms';
import { Variants } from 'framer-motion';

export interface IBtnLink {
	isChart: boolean;
}

const BtnLink = styled.div<IBtnLink>`
	display: flex;
	margin-bottom: 20px;

	button {
		background-color: #90cdf4;
		border-radius: 10px;
		width: 100%;
		height: 50px;
		opacity: 0.5;
		transition: opacity 0.25s ease-in-out;
		transition: opacity 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
		box-shadow: 10px 10px 14px 1px rgb(0 0 0 / 10%);

		&.isWakeup {
			opacity: ${(props) => (props.isChart ? '1' : '0.7')};
			pointer-events: ${(props) => (props.isChart ? 'none' : 'all')};
			box-shadow: ${(props) =>
				props.isChart ? 'none' : '10px 10px 14px 1px rgb(0 0 0 / 10%)'};
		}
		&.isSleep {
			opacity: ${(props) => (props.isChart ? '0.7' : '1')};
			pointer-events: ${(props) => (props.isChart ? 'all' : 'none')};
			box-shadow: ${(props) =>
				props.isChart ? '10px 10px 14px 1px rgb(0 0 0 / 10%)' : 'none'};
		}

		&:first-child {
			margin-right: 30px;
		}

		&:hover {
			opacity: 1;
			box-shadow: none;
		}
	}
`;

const chartVariants: Variants = {
	initial: {
		x: 500,
		opacity: 0,
		scale: 0,
	},
	animate: {
		x: 0,
		opacity: 1,
		scale: 1,
	},
	exit: {
		x: -500,
		opacity: 0,
		scale: 0,
	},
};

function Charts() {
	const { id } = useParams();
	const isChart = useRecoilValue(isChartAtom);

	return <>{isChart ? <Chart key={id} /> : <SleepChart key={id} />}</>;
}

export default Charts;
