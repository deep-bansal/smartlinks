import React from "react";
import logo from "../assets/logo.svg";

// Footer component
const Footer = () => {
	return (
		<footer className="footer">
			<div className="container">
				{/* Top section of the footer */}
				<FooterTop />

				{/* Bottom section of the footer */}
				<div className="section footer-bottom">
					<p className="copyright">
						&copy; smartLinks 2024. Published by{" "}
						<a href="#" className="copyright-link hover:underline">
							deepbansal
						</a>
						.
					</p>
				</div>
			</div>
		</footer>
	);
};

// Top section of the footer
const FooterTop = () => {
	return (
		<div className="footer-top section">
			<div className="footer-brand">
				<a href="#" className="logo">
					<img src={logo} width="129" height="40" alt="smartLinks logo" />
				</a>
				<p className="footer-text">
					A minimal, functional theme for running a paid-membership publication
					on Ghost.
				</p>
			</div>

			{/* Navigation lists */}
			<FooterList
				title="Social"
				items={[
					{ icon: "logo-facebook", text: "Facebook", url: "#" },
					{ icon: "logo-twitter", text: "Twitter", url: "#" },
					{ icon: "logo-pinterest", text: "Pinterest", url: "#" },
					{ icon: "logo-vimeo", text: "Vimeo", url: "#" },
				]}
			/>

			<FooterList
				title="About"
				items={[
					{ text: "Style Guide", url: "#" },
					{ text: "Features", url: "#" },
					{ text: "Contact", url: "#" },
					{ text: "404", url: "#" },
					{ text: "Privacy Policy", url: "#" },
				]}
			/>

			<FooterList
				title="Features"
				items={[
					{ text: "Upcoming Events", url: "#" },
					{ text: "Blog & News", url: "#" },
					{ text: "Features", url: "#" },
					{ text: "FAQ Question", url: "#" },
					{ text: "Testimonial", url: "#" },
				]}
			/>

			<FooterList
				title="Membership"
				items={[
					{ text: "Account", url: "#" },
					{ text: "Membership", url: "#" },
					{ text: "Subscribe", url: "#" },
					{ text: "Tags", url: "#" },
					{ text: "Authors", url: "#" },
				]}
			/>
		</div>
	);
};

// List component used in the footer
const FooterList = ({ title, items }) => {
	return (
		<ul className="footer-list">
			<li>
				<p className="h5">{title}</p>
			</li>
			{items.map((item, index) => (
				<li key={index} className="footer-list-item">
					{item.icon && <ion-icon name={item.icon}></ion-icon>}
					<a href={item.url} className="footer-link hover:underline">
						{item.text}
					</a>
				</li>
			))}
		</ul>
	);
};

export default Footer;
