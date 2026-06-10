import styles from "./SelectField.module.scss";
import type { UserRole } from "../../types";
import { useEffect, useRef, useState } from "react";

const ROLES: UserRole[] = [
	"Frontend Developer",
	"Backend Developer",
	"QA Engineer",
	"Designer",
	"Manager",
	"HR",
];

interface RoleSelectorProps {
	value: UserRole | "";
	onChange: (role: UserRole) => void;
	error?: string;
}

const SelectField = ({ value, onChange, error }: RoleSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (role: UserRole) => {
		onChange(role);
		setIsOpen(false);
	};

	return (
		<div className={styles.selector} ref={ref}>
			<p className={styles.selector__title}>
				Роль <span>*</span>
			</p>

			<div
				className={`${styles.selector__trigger} ${error ? styles._error : ""}`}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<span className={value ? "" : styles.selector__placeholder}>
					{value || "Выберите роль"}
				</span>
				<svg
					className={`${styles.selector__arrow} ${isOpen ? styles.selector__arrow_open : ""}`}
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 12 12"
				>
					<path fill="#666" d="M6 8L1 3h10z" />
				</svg>
			</div>

			{isOpen && (
				<ul className={styles.selector__dropdown}>
					{ROLES.map((role) => (
						<li
							key={role}
							className={`${styles.selector__option} ${value === role ? styles.selector__option_active : ""}`}
							onClick={() => handleSelect(role)}
						>
							{role}
						</li>
					))}
				</ul>
			)}

			{error && <span className={styles.selector__error}>{error}</span>}
		</div>
	);
};
export default SelectField;
