import styles from "./ErrorMessage.module.scss";

interface ErrorProps {
	msg: string;
}

const ErrorMessage = ({ msg }: ErrorProps) => {
	return (
		<div className={styles.errorMsg}>
			<p>{msg}</p>
		</div>
	);
};
export default ErrorMessage;
