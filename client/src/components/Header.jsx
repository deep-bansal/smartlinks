import React from "react";
import IonIcon from "@reacticons/ionicons";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./index";

const Header = () => {
	const navigate = useNavigate();
	const handleClick = (e) => {
		e.preventDefault();
		navigate("/login");
		console.log("Login clicked");
	};
	return (
		<>
			<header className="header section" data-header>
				<div className="container">
					<a href="#" className="logo">
						<img src={logo} width="129" height="40" alt="Blogy logo" />
					</a>

					<nav className="navbar" data-navbar>
						<ul className="navbar-list">
							<li className="navbar-item">
								<a
									href="#"
									className="navbar-link hover:underline"
									data-nav-link
								>
									Home
								</a>
							</li>
							<li className="navbar-item">
								<a
									href="#"
									className="navbar-link hover:underline"
									data-nav-link
								>
									Recent Post
								</a>
							</li>
							<li className="navbar-item">
								<a
									href="#"
									className="navbar-link hover:underline"
									data-nav-link
									onClick={handleClick}
								>
									Login
								</a>
							</li>
						</ul>
					</nav>

					{/* <div className="wrapper">
						<button
							className="search-btn"
							aria-label="search"
							data-search-toggler
						>
							<IonIcon name="search-outline" aria-hidden="true" />
							<span className="span">Search</span>
						</button>

						<button
							className="nav-toggle-btn"
							aria-label="toggle menu"
							data-nav-toggler
						>
							<span className="span one"></span>
							<span className="span two"></span>
							<span className="span three"></span>
						</button>

						<a href="#" className="btn">
							Join
						</a>
					</div> */}
				</div>
			</header>
			<SearchBar />
		</>
	);
};

export default Header;
