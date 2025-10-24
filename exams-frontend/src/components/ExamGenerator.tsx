import { useState } from "react";
import { useTranslation } from "react-i18next";
import { examApi } from "../api/exam";
import { useLanguage } from "../hooks/useLanguage";
import { useSubjects } from "../hooks/useSubjects";
import { useThreads } from "../hooks/useThreads";
import type { ExamType } from "../types/exam";
import type { Message } from "../types/thread";
import { ChatView } from "./ChatView";
import { ExamTypeSelector } from "./ExamTypeSelector";
import { Sidebar } from "./Sidebar";
import { SubjectInput } from "./SubjectInput";

export const ExamGenerator = () => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const { subjects, loading: subjectsLoading } = useSubjects();
	const {
		threads,
		currentThread,
		createThread,
		addMessage,
		selectThread,
		setCurrentThread,
	} = useThreads();

	const [selectedType, setSelectedType] = useState<ExamType | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [streamingMessage, setStreamingMessage] = useState<Message | null>(
		null,
	);

	const getSubjectName = (subjectKey: string): string => {
		const subject = subjects.find((s) => s.subject === subjectKey);
		if (subject) {
			const lang = currentLanguage === "es" ? "es" : "en";
			return subject.i18n[lang];
		}
		return subjectKey;
	};

	const handleGenerateExam = async (subject: string) => {
		if (!selectedType) return;

		setIsGenerating(true);
		setError(null);

		try {
			const subjectName = getSubjectName(subject);
			const examTypeName = t(`examTypes.${selectedType}`);

			const thread = await createThread(
				selectedType,
				subject,
				`${examTypeName} - ${subjectName}`,
			);

			const userMessage: Message = {
				content: t("examGenerator.userPrompt", {
					examType: t(`examTypes.${selectedType}`),
					subject: subjectName,
				}),
				id: `msg-${Date.now()}-user`,
				role: "user",
				timestamp: Date.now(),
			};

			await addMessage(thread.id, userMessage);

			const assistantMessageId = `msg-${Date.now()}-assistant`;
			const assistantMessage: Message = {
				content: "",
				id: assistantMessageId,
				role: "assistant",
				timestamp: Date.now(),
			};

			const request = { subject, type: selectedType };
			let accumulatedContent = "";
			let hasReceivedFirstToken = false;

			setStreamingMessage(assistantMessage);

			await examApi.streamExam(request, {
				onError: (errorMsg) => {
					setError(errorMsg);
					setIsGenerating(false);
					accumulatedContent += errorMsg;
					setStreamingMessage((prev) =>
						prev ? { ...prev, content: accumulatedContent } : null,
					);
				},
				onPause: (shouldContinue) => {
					console.log(`Stream paused: ${shouldContinue}`);
				},
				onRetry: (retryInSeconds) => {
					console.log(`Retrying in ${retryInSeconds} seconds...`);
				},
				onToken: (token) => {
					if (!hasReceivedFirstToken) {
						setIsGenerating(false);
						hasReceivedFirstToken = true;
					}
					accumulatedContent += token;
					setStreamingMessage((prev) =>
						prev ? { ...prev, content: accumulatedContent } : null,
					);
				},
			});

			await addMessage(thread.id, {
				...assistantMessage,
				content: accumulatedContent,
			});
			setStreamingMessage(null);
		} catch (err) {
			setError(t("examGenerator.error"));
			console.error(err);
			setIsGenerating(false);
		}
	};

	const handleNewThread = () => {
		setCurrentThread(null);
		setSelectedType(null);
		setError(null);
	};

	const handleSelectThread = (threadId: string) => {
		selectThread(threadId);
		setError(null);
	};

	return (
		<div className="flex h-screen overflow-hidden">
			<div className="w-64 h-screen overflow-hidden flex-shrink-0">
				<Sidebar
					threads={threads}
					currentThreadId={currentThread?.id || null}
					onSelectThread={handleSelectThread}
					onNewThread={handleNewThread}
				/>
			</div>

			<div className="flex-1 flex flex-col overflow-hidden">
				{!currentThread ? (
					<div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-y-auto">
						<div className="max-w-2xl w-full mx-auto p-10 my-10">
							<div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-200 dark:border-gray-700">
								<div className="text-center mb-10">
									<h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-3">
										{t("examGenerator.title")}
									</h1>
									<p className="text-gray-500 dark:text-gray-400 text-lg">
										{t("examGenerator.subtitle")}
									</p>
								</div>

								<div className="space-y-8">
									<ExamTypeSelector
										selectedType={selectedType}
										onSelectType={setSelectedType}
									/>

									<SubjectInput
										onSubmit={handleGenerateExam}
										disabled={isGenerating || !selectedType}
										subjects={subjects}
										loading={subjectsLoading}
										isGenerating={isGenerating}
									/>
								</div>

								{error && (
									<div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<svg
													className="h-5 w-5 text-red-500 dark:text-red-400"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<title>{t("common.error")}</title>
													<path
														fillRule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<p className="ml-3 text-red-700 dark:text-red-300 font-medium">
												{error}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					<ChatView
						thread={currentThread}
						isGenerating={isGenerating}
						streamingMessage={streamingMessage}
					/>
				)}
			</div>
		</div>
	);
};
