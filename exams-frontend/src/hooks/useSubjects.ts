import { useEffect, useState } from "react";
import { subjectsApi } from "../api/subjects";
import type { SubjectInfo } from "../types/exam";

let cachedSubjects: SubjectInfo[] | null = null;
let loadingPromise: Promise<SubjectInfo[]> | null = null;

export const useSubjects = () => {
	const [subjects, setSubjects] = useState<SubjectInfo[]>(cachedSubjects || []);
	const [loading, setLoading] = useState(!cachedSubjects);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (cachedSubjects) {
			setSubjects(cachedSubjects);
			setLoading(false);
			return;
		}

		if (loadingPromise) {
			loadingPromise
				.then((data) => {
					setSubjects(data);
					setLoading(false);
				})
				.catch((err) => {
					setError(
						err instanceof Error ? err : new Error("Failed to load subjects"),
					);
					setLoading(false);
				});
			return;
		}

		const loadSubjects = async () => {
			try {
				const data = await subjectsApi.getSubjects();
				cachedSubjects = data;
				setSubjects(data);
				return data;
			} catch (err) {
				const error =
					err instanceof Error ? err : new Error("Failed to load subjects");
				setError(error);
				throw error;
			} finally {
				loadingPromise = null;
				setLoading(false);
			}
		};

		loadingPromise = loadSubjects();
	}, []);

	return { error, loading, subjects };
};
