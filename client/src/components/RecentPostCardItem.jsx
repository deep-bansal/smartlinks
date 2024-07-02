import React from "react";
import { AvatarItem } from "./";
import recent1 from "../assets/recent-1.jpg";

function RecentPostCardItem({ post, index }) {
	// console.log(props);
	return (
		<li key={index}>
			<div className="blog-card">
				<figure
					className="card-banner img-holder"
					style={{ "--width": 550, "--height": 660 }}
				>
					<img
						src={recent1}
						width="550"
						height="660"
						loading="lazy"
						alt={post.title}
						className="img-cover"
					/>
					<ul className="avatar-list absolute">
						{post.authors.map((author, i) => (
							<AvatarItem />
						))}
					</ul>
				</figure>
				<div className="card-content">
					<ul className="card-meta-list">
						{post.tags.map((tag, i) => (
							<li key={i}>
								<a href="#" className="card-tag">
									{tag}
								</a>
							</li>
						))}
					</ul>
					<h3 className="h4">
						<a href="#" className="card-title hover:underline">
							{post.title}
						</a>
					</h3>
					<p className="card-text">{post.text}</p>
				</div>
			</div>
		</li>
	);
}

export default RecentPostCardItem;
