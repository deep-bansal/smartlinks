import React from "react";
import { RecommendedCardItem } from "./";

function Recommended() {
	return (
		<section className="section recommended" aria-label="recommended post">
			<div className="container">
				<p className="section-subtitle">
					<strong className="strong">Recommended</strong>
				</p>
				<ul className="grid-list">
					{/* Render each card */}
					<RecommendedCardItem
						imageSrc="./assets/images/recommended-1.jpg"
						altText="The trick to getting more done is to have the freedom to roam around"
						title="The trick to getting more done is to have the freedom to roam around"
						authorAvatars={[
							"./assets/images/author-5.jpg",
							"./assets/images/author-2.jpg",
						]}
					/>
					{/* Repeat for other cards */}
				</ul>
			</div>
		</section>
	);
}

export default Recommended;
