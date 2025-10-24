import { useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { type StylesConfig } from "react-select";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../hooks/useLanguage";
import type { SubjectInfo } from "../types/exam";

type SubjectInputProps = {
	onSubmit: (subject: string) => void;
	disabled?: boolean;
	subjects: SubjectInfo[];
	loading?: boolean;
	isGenerating?: boolean;
};

export const SubjectInput = ({
	onSubmit,
	disabled,
	subjects,
	loading = false,
	isGenerating = false,
}: SubjectInputProps) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const { isDark } = useTheme();
	const [selectedSubject, setSelectedSubject] = useState<{
		value: string;
		label: string;
	} | null>(null);

	const handleSubjectSelect = (
		option: { value: string; label: string } | null,
	) => {
		setSelectedSubject(option);
	};

	const handleGenerateClick = () => {
		if (selectedSubject) {
			onSubmit(selectedSubject.value);
		}
	};

	const lang = currentLanguage === "es" ? "es" : "en";

	const subjectOptions = (subjects || []).map((sub) => ({
		label: sub.i18n[lang],
		value: sub.subject,
	}));

	type OptionType = { label: string; value: string };

	const getCustomStyles = (): StylesConfig<OptionType, false> => {
		if (isDark) {
			return {
				control: (provided) => ({
					...provided,
					"&:hover": {
						borderColor: "rgb(96, 165, 250)",
					},
					backgroundColor: "rgb(31, 41, 55)",
					borderColor: "rgb(75, 85, 99)",
					borderRadius: "0.75rem",
					minHeight: "56px",
				}),
				input: (provided) => ({
					...provided,
					color: "rgb(229, 231, 235)",
				}),
				menu: (provided) => ({
					...provided,
					backgroundColor: "rgb(31, 41, 55)",
					borderRadius: "0.75rem",
					boxShadow:
						"0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
					overflow: "hidden",
				}),
				menuList: (provided) => ({
					...provided,
					backgroundColor: "rgb(31, 41, 55)",
					maxHeight: "300px",
					padding: "0.5rem",
				}),
				option: (provided, state) => ({
					...provided,
					"&:active": {
						backgroundColor: "rgba(59, 130, 246, 0.2)",
					},
					backgroundColor: state.isSelected
						? "rgb(59, 130, 246)"
						: state.isFocused
							? "rgba(59, 130, 246, 0.1)"
							: "rgb(31, 41, 55)",
					color: state.isSelected ? "white" : "rgb(229, 231, 235)",
					cursor: "pointer",
				}),
				placeholder: (provided) => ({
					...provided,
					color: "rgb(107, 114, 128)",
				}),
				singleValue: (provided) => ({
					...provided,
					color: "rgb(229, 231, 235)",
				}),
			};
		}

		return {
			control: (provided) => ({
				...provided,
				"&:hover": {
					borderColor: "rgb(96, 165, 250)",
				},
				backgroundColor: "white",
				borderColor: "rgb(209, 213, 219)",
				borderRadius: "0.75rem",
				minHeight: "56px",
			}),
			input: (provided) => ({
				...provided,
				color: "rgb(17, 24, 39)",
			}),
			menu: (provided) => ({
				...provided,
				backgroundColor: "white",
				borderRadius: "0.75rem",
				boxShadow:
					"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
				overflow: "hidden",
			}),
			menuList: (provided) => ({
				...provided,
				backgroundColor: "white",
				maxHeight: "300px",
				padding: "0.5rem",
			}),
			option: (provided, state) => ({
				...provided,
				"&:active": {
					backgroundColor: "rgb(96, 165, 250)",
				},
				backgroundColor: state.isSelected
					? "rgb(59, 130, 246)"
					: state.isFocused
						? "rgb(239, 246, 255)"
						: "white",
				color: state.isSelected ? "white" : "rgb(55, 65, 81)",
				cursor: "pointer",
			}),
			placeholder: (provided) => ({
				...provided,
				color: "rgb(156, 163, 175)",
			}),
			singleValue: (provided) => ({
				...provided,
				color: "rgb(17, 24, 39)",
			}),
		};
	};

	return (
		<div className="space-y-4 animate-fade-in">
			<h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
				{t("examGenerator.selectSubject")}
			</h3>

			{loading ? (
				<div className="flex flex-col gap-3">
					{[...Array(6)].map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: Loading skeleton placeholder
							key={i}
							className="h-14 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
						/>
					))}
				</div>
			) : (
				<>
					<Select
						options={subjectOptions}
						value={selectedSubject}
						onChange={handleSubjectSelect}
						placeholder={t("examGenerator.selectSubject")}
						isDisabled={disabled}
						isSearchable={true}
						isClearable={true}
						styles={getCustomStyles()}
						noOptionsMessage={() => t("examGenerator.noSubjectsFound")}
					/>

					<button
						type="button"
						onClick={handleGenerateClick}
						disabled={disabled || !selectedSubject}
						className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
							text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl 
							transform hover:scale-105 active:scale-95 transition-all duration-200
							disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg
							dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600
							cursor-pointer"
					>
						{isGenerating
							? t("examGenerator.generating")
							: t("examGenerator.generate")}
					</button>
				</>
			)}
		</div>
	);
};
