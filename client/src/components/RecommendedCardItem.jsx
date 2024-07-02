import React from "react";

function RecommendedCardItem({ imageSrc, altText, title, authorAvatars }) {
	return (
		<li>
			<div className="blog-card">
				<figure
					className="card-banner img-holder"
					style={{ "--width": 300, "--height": 360 }}
				>
					<img
						src={imageSrc}
						width="300"
						height="360"
						loading="lazy"
						alt={altText}
						className="img-cover"
					/>
					<ul className="avatar-list absolute">
						{/* Render author avatars */}
						{authorAvatars.map((avatarSrc, index) => (
							<li key={index} className="avatar-item">
								<a
									href="#"
									className="avatar img-holder"
									style={{ "--width": 100, "--height": 100 }}
								>
									<img
										src={avatarSrc}
										width="100"
										height="100"
										loading="lazy"
										alt="Author"
										className="img-cover"
									/>
								</a>
							</li>
						))}
					</ul>
				</figure>
				<div className="card-content">
					<h3 className="h5">
						<a href="#" className="card-title hover:underline">
							{title}
						</a>
					</h3>
				</div>
			</div>
		</li>
	);
}

export default RecommendedCardItem;
