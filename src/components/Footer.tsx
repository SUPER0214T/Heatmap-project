import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
	min-height: 216px;
	width: 100%;
	padding: 32px;
	background-color: ${(props) => props.theme.footerBgColor};
	color: white;
`;

const FooterContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 1240px;
	margin: 0 auto;

	.footer {
		&-top {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 32px;

			.footer-card {
				padding: 0 16px;
				flex: 1;
			}

			.footer-title {
				font-weight: 700;
				margin-bottom: 16px;
			}

			.footer-items {
				width: 100%;
				flex: 1;
			}

			.footer-item {
				display: flex;
				align-items: center;
				height: 32px;
				width: 100%;

				a {
					transition: color 0.2s ease-in-out;

					&:hover {
						text-decoration: underline;
						color: #3578e5;
					}
				}
			}
		}

		&-bottom {
			text-align: center;
		}
	}
`;

function Footer() {
	return (
		<FooterWrapper>
			<FooterContainer>
				<div className="footer-top">
					<div className="footer-card">
						<h3 className="footer-title">Developer/Comment</h3>
						<ul className="footer-items">
							<li className="footer-item">
								<span>김준영</span>
							</li>
							<li className="footer-item">
								<p>피드백은 메일로 보내주세요!</p>
							</li>
						</ul>
					</div>
					<div className="footer-card">
						<h3 className="footer-title">Contact</h3>
						<ul className="footer-items">
							<li className="footer-item">
								<a href="mailto:twinjyjh2@gmail.com">twinjyjh2@gmail.com</a>
							</li>
							<li className="footer-item">
								<a
									href="https://github.com/SUPERPET21"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
								</a>
							</li>
						</ul>
					</div>
					<div className="footer-card">
						<h3 className="footer-title">Docs</h3>
						<ul className="footer-items">
							<li className="footer-item">
								<Link
									to="/pages/terms"
									target="_blank"
									rel="noopener noreferrer"
								>
									주의사항/사용방법
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="footer-bottom">
					<span>Copyright © 2021 김준영. All Rights Reserved.</span>
				</div>
			</FooterContainer>
		</FooterWrapper>
	);
}

export default Footer;
