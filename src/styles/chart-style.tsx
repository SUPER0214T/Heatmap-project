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
