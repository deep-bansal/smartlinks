import React from "react";

const Hero = () => {
	return (
		<section className="section hero" aria-label="home">
			<div className="container">
				<h1 className="h1 hero-title">
					<strong className="strong">Hey, we’re ArticleVerse.</strong> See our
					thoughts, stories and ideas.
				</h1>

				<div className="wrapper">
					<form action="" className="newsletter-form">
						<input
							type="text"
							name="search-text"
							placeholder="Search"
							className="email-field"
						/>
						<button type="submit" className="btn">
							Search
						</button>
					</form>

					<p className="newsletter-text">
						Find the latest stories, articles, and news from ArticleVerse.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Hero;
