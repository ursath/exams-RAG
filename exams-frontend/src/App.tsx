import { Amplify } from "aws-amplify";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { awsconfig } from "./constants/config";
import { LogInPage } from "./pages/LogInPage";
import { PromptPage } from "./pages/PromptPage";
import { PrivateRoutes } from "./routes/PrivateRoutes";

try {
	Amplify.configure(awsconfig);
} catch (error) {
	console.error("Failed to configure Amplify:", error);
	throw error;
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LogInPage />} />
				<Route element={<PrivateRoutes />}>
					<Route path="/prompt" element={<PromptPage />} />
					<Route path="*" element={<Navigate to="/prompt" />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
