import React from "react";
import { AvatarItem, CardItem, RecentPostCardItem } from ".";
import recentposts from "../data/recentdata.json";

const RecentPost = () => {
	// console.log(recentposts);
	return (
		<section className="section recent" aria-label="recent post">
			<div className="container">
				<div className="title-wrapper">
					<h2 className="h2 section-title">
						See what we’ve <strong className="strong">written lately</strong>
					</h2>
					<div className="top-author">
						<ul className="avatar-list">
							{[
								"author-1.jpg",
								"author-2.jpg",
								"author-3.jpg",
								"author-4.jpg",
								"author-5.jpg",
							].map((author, index) => (
								<AvatarItem key={index} />
							))}
						</ul>
						<span className="span">Meet our top authors</span>
					</div>
				</div>

				<ul className="grid-list">
					{recentposts.map((post, index) => (
						<RecentPostCardItem key={index} post={post} />
					))}
					{/* <CardItem />
                    <CardItem />
                    <CardItem />
                    <CardItem /> */}
				</ul>
				<button className="btn">Load more</button>
			</div>
		</section>
	);
};

export default RecentPost;
