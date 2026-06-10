import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => {
	return (
		<div className={styles.notFound}>
			<h1>404 NotFound</h1>
			<Link className={"btn"} to="/">
				На главную
			</Link>
		</div>
	);
};
export default NotFound;
