import React from 'react';
import styled from 'styled-components';

const TermWrapper = styled.div`
	min-height: 100vh;
	padding: 1% 10%;
	padding-top: 120px;
	section {
		margin-bottom: 25px;

		h2 {
			font-size: 2rem;
			font-weight: 700;
			margin-bottom: 16px;
		}

		li {
			font-size: 18px;
			margin-bottom: 10px;
			position: relative;
			display: flex;
			align-items: flex-start;

			&::before {
				font-size: 14px;
				content: '-';
				display: block;
				position: absolute;
			}

			span {
				padding-left: 20px;
				line-height: 27px;
			}
		}

		&.last-word {
			p {
				font-size: 18px;
				line-height: 27px;
				margin-bottom: 32px;
			}

			h4 {
				font-size: 2rem;
				font-weight: 700;
				text-align: left;
			}
		}
	}
`;

function Terms() {
	return (
		<TermWrapper>
			<section>
				<h2>주의사항</h2>
				<ul>
					<li>
						<span>00:00 이후에는 전날 데이터를 수정할 수 없습니다.</span>
					</li>
					<li>
						<span>매월 1일에 해당 월의 그래프가 새로 생성됩니다.</span>
					</li>
					<li>
						<span>
							매월 1일이 되면 이전 달의 그래프에 데이터를 추가/변경할 수
							없습니다.
						</span>
					</li>
					<li>
						<span>기상 시간과 취침 시간의 시간 입력 범위가 다릅니다.</span>
					</li>
				</ul>
			</section>
			<section>
				<h2>사용방법</h2>
				<ol>
					<li>
						<span>
							시간을 입력하신 후 시간 입력/수정 버튼을 누르시면 최초 입력 시에는
							추가가 되고 최초가 아니라면 수정이 됩니다.
						</span>
					</li>
					<li>
						<span>당일에는 기상/취침 시간을 삭제 또는 수정할 수 있습니다.</span>
					</li>
					<li>
						<span>
							평균 기상 시간은 한 달을 평균으로 계산한 것이고, 매일 입력한 값에
							따라 평균 시간이 계산됩니다.
						</span>
					</li>
				</ol>
			</section>
			<section>
				<h2>개발자 코멘트</h2>
				<ol>
					<li>
						<span>
							계속해서 기능을 추가하고 있으며, 페이지의 디자인도 수정하고
							있습니다.
						</span>
					</li>
					<li>
						<span>
							디자인하시는 분 없이 혼자 제작한 것이라 디자인이 많이 부족한 점
							양해 부탁드립니다.
						</span>
					</li>
					<li>
						<span>
							기능을 구현하는 데에 있어서 기술이 부족하기 때문에 오류가 발생할
							수 있습니다. 오류가 발생한 경우 메일로 보내주시면 신속하게
							해결하겠습니다.
						</span>
					</li>
					<li>
						<span>
							기능 및 디자인에 있어서 추가/수정할 사항들을 메일로 보내주시면
							적극 반영하겠습니다!
						</span>
					</li>
					<li>
						<span>
							또한, 기상/취침 시간 기록 그래프뿐만 아니라 다른 종류의 프로그램도
							제작할 예정입니다.
						</span>
					</li>
				</ol>
			</section>
			<section className="last-word">
				<p>
					자신을 더욱 성장시키고, 어제보다 나은 오늘, 어제보다 성장한 오늘을
					만들고자 하시는 분들에게 도움을 드리기 위해 제작하였습니다.
					<br /> 앞으로 더욱 성장하는 개발자가 될 수 있도록 최선을 다하겠습니다.
				</p>
				<h4>제가 제작한 프로그램에 관심을 가져 주셔서 정말 감사합니다.</h4>
			</section>
		</TermWrapper>
	);
}

export default Terms;
