import styles from "./ErrorMessage.module.scss";

interface ErrorProps {
	msg: string;
	result: "error" | "success";
}

const ErrorMessage = ({ msg, result }: ErrorProps) => {
	return (
		<div className={`${styles.errorMsg} ${result === "error" ? styles._error : styles._success}`}>
			<p>{msg}</p>
		</div>
	);
};
export default ErrorMessage;
