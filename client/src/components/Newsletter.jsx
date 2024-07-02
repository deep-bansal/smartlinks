import React from "react";

const Newsletter = () => {
	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle form submission logic here
	};

	return (
		<section className="section newsletter">
			<h2 className="h2 section-title">
				Subscribe to <strong className="strong">new posts</strong>
			</h2>

			<form action="" className="newsletter-form" onSubmit={handleSubmit}>
				<input
					type="email"
					name="email_address"
					placeholder="Your email address"
					required
					className="email-field"
				/>

				<button type="submit" className="btn">
					Subscribe
				</button>
			</form>
		</section>
	);
};

export default Newsletter;
