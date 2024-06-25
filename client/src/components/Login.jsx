// import axios from "axios";
function Login() {
	const login = () => {
		window.open("http://localhost:3000/api/v1/user/auth/google", "_self");
	};
	return (
		<div>
			<button onClick={login}>Login with Google</button>
		</div>
	);
}

export default Login;
