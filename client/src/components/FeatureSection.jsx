import React from "react";
import { CardItem } from "./";

const FeaturedSection = () => {
	return (
		<section className="section featured" aria-label="featured post">
			<div className="container">
				<p className="section-subtitle">
					Get started with our <strong className="strong">best stories</strong>
				</p>

				<ul className="has-scrollbar">
					<CardItem />
					<CardItem />
					<CardItem />
					<CardItem />
					<CardItem />
					<CardItem />
				</ul>
			</div>
		</section>
	);
};

export default FeaturedSection;
