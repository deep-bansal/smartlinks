import React from "react";
import IonIcon from "@reacticons/ionicons";

const SearchBar = () => {
	return (
		<>
			<div className="search-bar" data-search-bar>
				<div className="input-wrapper">
					<input
						type="search"
						name="search"
						placeholder="Search"
						className="input-field"
					/>
					<button
						className="search-close-btn"
						aria-label="close search bar"
						data-search-toggler
					>
						<IonIcon name="close-outline" aria-hidden="true" />
					</button>
				</div>
				<p className="search-bar-text">Please enter at least 3 characters</p>
			</div>
			<div className="overlay" data-overlay data-search-toggler></div>
		</>
	);
};

export default SearchBar;
