import styles from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { removeUser } from "../../store/slices/authSlice";
import { logoutRequest } from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { openModal } from "../../store/slices/postsSlice";

const Header = () => {
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutRequest();
			dispatch(removeUser());
			navigate("/auth");
		} catch (error) {
			console.error(error);
		}
	};

	const initials = user ? `${user.nickname[0].toUpperCase()}` : "?";

	return (
		<header className={styles.header}>
			<div className={styles.header__left}>
				<Link to="/" className={styles.header__logo}>
					<div className={styles.header__logoIcon}>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.5"
							strokeLinecap="round"
						>
							<path d="M7 8l-4 4l4 4M17 8l4 4l-4 4M14 4l-4 16" />
						</svg>
					</div>
					<span className={styles.header__logoText}>DevPlatform</span>
				</Link>

				<div className={styles.header__divider} />

				<Link to={`/profile/${user?.id}`} className={styles.header__user}>
					<div className={styles.header__avatar}>{initials}</div>
					<div className={styles.header__info}>
						<p className={styles.header__nickname}>{user?.nickname}</p>
						<p className={styles.header__role}>{user?.role}</p>
					</div>
				</Link>
			</div>
			<div className={styles.header__right}>
				<button className={styles.header__btn} onClick={() => dispatch(openModal(null))}>
					<span>+</span> Создать пост
				</button>

				<button className={styles.header__logout} onClick={handleLogout} aria-label="Выйти">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
						<path d="M9 12h12l-3 -3" />
						<path d="M18 15l3 -3" />
					</svg>
					Выйти
				</button>
			</div>
		</header>
	);
};

export default Header;
