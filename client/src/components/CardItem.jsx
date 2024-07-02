import React from "react";
import featured1 from "../assets/featured-1.jpg";
import { AvatarItem } from "./";

function CardItem() {
	return (
		<li className="scrollbar-item">
			<div className="blog-card">
				<figure
					className="card-banner img-holder"
					style={{ "--width": 500, "--height": 600 }}
				>
					<img
						src={featured1}
						width="500"
						height="600"
						loading="lazy"
						alt="New technology is not good or evil in and of itself"
						className="img-cover"
					/>
					<ul className="avatar-list absolute">
						<AvatarItem />
						<AvatarItem />
					</ul>
				</figure>
				<div className="card-content">
					<ul className="card-meta-list">
						<li>
							<a href="#" className="card-tag">
								Design
							</a>
						</li>
						<li>
							<a href="#" className="card-tag">
								Idea
							</a>
						</li>
						<li>
							<a href="#" className="card-tag">
								Review
							</a>
						</li>
					</ul>
					<h3 className="h4">
						<a href="#" className="card-title hover:underline">
							New technology is not good or evil in and of itself
						</a>
					</h3>
					<p className="card-text">
						Vestibulum vehicula dui venenatis neque tempor, accumsan iaculis
						sapien ornare. Sed at ante porta, ullamcorper massa eu, ullamcorper
						sapien. Donec pretium tortor augue. Integer egestas ut tellus sed
						pretium. Nullam tristique augue ut mattis vulputate. Duis et lorem
						in odio ultricies porttitor.
					</p>
				</div>
			</div>
		</li>
	);
}

export default CardItem;
