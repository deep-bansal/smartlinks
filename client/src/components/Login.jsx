// import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./login.module.css";
function Login() {
	const login = () => {
		window.open("http://localhost:3000/api/v1/user/auth/google", "_self");
	};
	return (
		<div className={styles.bgImg}>
			<div className={styles.content}>
				<header className={styles.header}>Login</header>
				<form action="#">
					<div className={styles.field}>
						<span className="fa fa-user"></span>
						<input type="text" required placeholder="Email or Username" />
					</div>
					<div className={`${styles.field} ${styles.space}`}>
						<span className="fa fa-lock"></span>
						<input
							type="password"
							className={styles.passKey}
							required
							placeholder="Password"
						/>
						<span className={styles.show}>SHOW</span>
					</div>
					<div className={styles.pass}>
						<a href="#">Forgot Password?</a>
					</div>
					<div className={styles.field}>
						<input type="submit" value="LOGIN" />
					</div>
				</form>
				<div className={styles.login}>Or login with</div>
				<div className={styles.links}>
					<div className={styles.facebook}>
						<i className="">
							<span>Google</span>
						</i>
					</div>
				</div>
				<div className={styles.signup}>
					Don't have account?
					<a href="#">Signup Now</a>
				</div>
			</div>
		</div>
	);
}

export default Login;
