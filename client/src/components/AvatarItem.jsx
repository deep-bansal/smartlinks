import React from "react";
import author1 from "../assets/author-1.jpg";

function AvatarItem() {
	return (
		<li className="avatar-item">
			<a
				href="#"
				className="avatar img-holder"
				style={{ "--width": 100, "--height": 100 }}
			>
				<img
					src={author1}
					width="100"
					height="100"
					loading="lazy"
					alt="Author"
					className="img-cover"
				/>
			</a>
		</li>
	);
}

export default AvatarItem;
