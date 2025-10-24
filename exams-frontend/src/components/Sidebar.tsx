import { signOut } from "aws-amplify/auth";
import { useTranslation } from "react-i18next";
import { FaMoon, FaSignOutAlt, FaSun, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useUserContext } from "../context/UserContext";
import type { Thread } from "../types/thread";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SidebarProps = {
	currentThreadId: string | null;
	onNewThread: () => void;
	onSelectThread: (threadId: string) => void;
	threads: Thread[];
};

export const Sidebar = ({
	threads,
	currentThreadId,
	onSelectThread,
	onNewThread,
}: SidebarProps) => {
	const { t } = useTranslation();
	const { currentUser, userAttributes, isLoading } = useUserContext();
	const { isDark, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate("/login");
		} catch {}
	};

	return (
		<div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-2xl">
			{/* Header with App Info */}
			<div className="p-6 border-b border-white/20 dark:border-white/10">
				<div className="flex items-center justify-between mb-4">
					<LanguageSwitcher />
					<button
						type="button"
						onClick={toggleTheme}
						className="p-2 rounded-lg bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 transition-all cursor-pointer"
						title={isDark ? "Light mode" : "Dark mode"}
					>
						{isDark ? (
							<FaSun className="w-4 h-4" />
						) : (
							<FaMoon className="w-4 h-4" />
						)}
					</button>
				</div>
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm">
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
							<title>{t("app.title")}</title>
							<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
							<path
								fillRule="evenodd"
								d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div>
						<h2 className="text-xl font-bold">{t("app.title")}</h2>
						<p className="text-blue-200 dark:text-gray-400 text-xs">
							{t("app.subtitle")}
						</p>
					</div>
				</div>
			</div>

			{/* New Exam Button */}
			<div className="p-4 border-b border-white/20 dark:border-white/10">
				<button
					type="button"
					onClick={onNewThread}
					className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>{t("examGenerator.newExam")}</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					{t("examGenerator.newExam")}
				</button>
			</div>

			{/* Threads List - Scrollable */}
			<div className="flex-1 overflow-y-auto p-2">
				{threads.length === 0 ? (
					<div className="text-center text-white/70 dark:text-gray-400 mt-8 px-4">
						<p className="text-sm">{t("examGenerator.noThreads")}</p>
					</div>
				) : (
					<div className="space-y-1">
						{threads.map((thread) => (
							<button
								key={thread.id}
								type="button"
								onClick={() => onSelectThread(thread.id)}
								className={`w-full text-left px-4 py-3 rounded-lg transition-all cursor-pointer ${
									currentThreadId === thread.id
										? "bg-white/20 dark:bg-white/10 shadow-md border-l-4 border-white"
										: "hover:bg-white/10 dark:hover:bg-white/5"
								}`}
							>
								<h3 className="font-semibold text-sm text-white truncate">
									{thread.title}
								</h3>
								<p className="text-xs text-white/70 dark:text-gray-400 mt-1">
									{new Date(thread.updatedAt).toLocaleDateString()}
								</p>
							</button>
						))}
					</div>
				)}
			</div>

			{/* User Info & Sign Out */}
			<div className="p-4 border-t border-white/20 dark:border-white/10 bg-black/10 dark:bg-black/20">
				{isLoading ? (
					<div className="animate-pulse space-y-3">
						<div className="h-12 bg-white/20 dark:bg-white/10 rounded-xl" />
						<div className="h-10 bg-white/20 dark:bg-white/10 rounded-xl" />
					</div>
				) : (
					<>
						<div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-lg ring-2 ring-white/30 dark:ring-white/10">
								<FaUser className="text-white text-lg" />
							</div>
							<div className="flex-1 overflow-hidden">
								<p className="text-sm font-semibold truncate">
									{userAttributes?.name ||
										userAttributes?.email ||
										currentUser?.username ||
										t("auth.user")}
								</p>
								<p className="text-xs text-blue-200 dark:text-gray-400">
									{t("auth.activeAccount")}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={handleSignOut}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl transition-all font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl cursor-pointer"
						>
							<FaSignOutAlt />
							<span>{t("auth.signOut")}</span>
						</button>
					</>
				)}
			</div>
		</div>
	);
};
