import styles from "./SelectField.module.scss";
import { useEffect, useRef, useState } from "react";

interface SelectFieldProps<T extends string> {
	value: T | "";
	onChange: (value: T) => void;
	options: T[];
	label: string;
	placeholder?: string;
	error?: string;
}

const SelectField = <T extends string>({
	value,
	onChange,
	options,
	label,
	placeholder = "Выберите...",
	error,
}: SelectFieldProps<T>) => {
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

	const handleSelect = (option: T) => {
		onChange(option);
		setIsOpen(false);
	};

	return (
		<div className={styles.selector} ref={ref}>
			<p className={styles.selector__title}>
				{label} <span>*</span>
			</p>

			<div
				className={`${styles.selector__trigger} ${error ? styles._error : ""}`}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<span className={value ? "" : styles.selector__placeholder}>
					{value || placeholder}
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
					{options.map((option) => (
						<li
							key={option}
							className={`${styles.selector__option} ${value === option ? styles.selector__option_active : ""}`}
							onClick={() => handleSelect(option)}
						>
							{option}
						</li>
					))}
				</ul>
			)}

			{error && <span className={styles.selector__error}>{error}</span>}
		</div>
	);
};

export default SelectField;
