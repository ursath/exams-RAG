import { ExamGenerator } from "../components/ExamGenerator";
import { ThemeProvider } from "../context/ThemeContext";
import { UserContextProvider } from "../context/UserContext";

export const PromptPage = () => {
	return (
		<ThemeProvider>
			<UserContextProvider>
				<div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
					<ExamGenerator />
				</div>
			</UserContextProvider>
		</ThemeProvider>
	);
};
