import { useTranslation } from "react-i18next";
import type { ExamType } from "../types/exam";

type ExamResultProps = {
	content: string;
	isGenerating: boolean;
	examType: ExamType | null;
	onReset: () => void;
};

export const ExamResult = ({
	content,
	isGenerating,
	examType,
	onReset,
}: ExamResultProps) => {
	const { t } = useTranslation();

	const handleDownload = () => {
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${examType}-${new Date().toISOString().split("T")[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(content);
			alert(t("examGenerator.copied"));
		} catch {
			alert(t("common.error"));
		}
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
				<div>
					<h2 className="text-3xl font-bold text-gray-800">{examType}</h2>
					<p className="text-gray-500 mt-1">
						{isGenerating
							? t("examGenerator.generating")
							: t("examGenerator.generationComplete")}
					</p>
				</div>
				<button
					type="button"
					onClick={onReset}
					className="px-5 py-2 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium flex items-center gap-2"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>{t("examGenerator.new")}</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					{t("examGenerator.newGeneration")}
				</button>
			</div>

			<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 min-h-[500px] border-2 border-gray-200 shadow-inner">
				{isGenerating && !content && (
					<div className="flex items-center justify-center h-[500px]">
						<div className="text-center">
							<div className="relative">
								<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6" />
								<div className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-indigo-300 mx-auto animate-pulse" />
							</div>
							<p className="text-gray-600 text-lg font-medium">
								{t("examGenerator.generatingExam")}
							</p>
							<p className="text-gray-400 text-sm mt-2">
								{t("examGenerator.mayTakeMoments")}
							</p>
						</div>
					</div>
				)}

				{content && (
					<div className="prose max-w-none">
						<pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
							{content}
						</pre>
						{isGenerating && (
							<span className="inline-block w-2 h-6 bg-blue-500 animate-pulse ml-1 align-middle" />
						)}
					</div>
				)}
			</div>

			{content && !isGenerating && (
				<div className="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onClick={handleCopy}
						className="px-6 py-3 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all font-semibold flex items-center gap-2"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>{t("examGenerator.copy")}</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						{t("examGenerator.copy")}
					</button>
					<button
						type="button"
						onClick={handleDownload}
						className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>{t("examGenerator.download")}</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						{t("examGenerator.download")}
					</button>
				</div>
			)}
		</div>
	);
};
