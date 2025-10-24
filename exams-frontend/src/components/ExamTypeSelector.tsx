import { useTranslation } from "react-i18next";
import type { ExamType } from "../types/exam";

type ExamTypeSelectorProps = {
	selectedType: ExamType | null;
	onSelectType: (type: ExamType) => void;
};

const EXAM_TYPES: { value: ExamType; key: string }[] = [
	{ key: "examTypes.firstMidterm", value: "midterm1" },
	{ key: "examTypes.secondMidterm", value: "midterm2" },
	{ key: "examTypes.final", value: "final" },
];

export const ExamTypeSelector = ({
	selectedType,
	onSelectType,
}: ExamTypeSelectorProps) => {
	const { t } = useTranslation();

	return (
		<div className="space-y-4 animate-fade-in">
			<h3 className="text-xl font-bold text-gray-800 dark:text-white">
				{t("examGenerator.selectType")}
			</h3>
			<div className="flex flex-col gap-3">
				{EXAM_TYPES.map(({ value, key }) => (
					<button
						key={value}
						type="button"
						onClick={() => onSelectType(value)}
						className={`group relative px-8 py-4 rounded-xl border-2 transition-all font-semibold cursor-pointer ${
							selectedType === value
								? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 shadow-md"
								: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg"
						}`}
					>
						<div className="flex items-center justify-between">
							<span>{t(key)}</span>
							{selectedType === value && (
								<svg
									className="w-6 h-6 text-blue-500 dark:text-blue-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>{t("examGenerator.selected")}</title>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</div>
					</button>
				))}
			</div>
		</div>
	);
};
