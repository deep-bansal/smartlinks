const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: false, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: '"SmartLinks 👻" <smartlinks@mailTrap.com>', // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		text: options.message, // plain text body
	};

	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
