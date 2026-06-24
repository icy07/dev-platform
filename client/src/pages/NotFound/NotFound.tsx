import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";
import { useEffect } from "react";

const NotFound = () => {
	useEffect(() => {
		document.title = "Страница не найдена";
	}, []);

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
