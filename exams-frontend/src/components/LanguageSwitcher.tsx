import { useLanguage } from "../hooks/useLanguage";

export const LanguageSwitcher = () => {
	const { currentLanguage, changeLanguage } = useLanguage();

	return (
		<div className="flex gap-2">
			<button
				type="button"
				onClick={() => changeLanguage("es")}
				className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
					currentLanguage === "es"
						? "bg-white/30 text-white"
						: "text-white/70 hover:bg-white/20"
				}`}
			>
				ES
			</button>
			<button
				type="button"
				onClick={() => changeLanguage("en")}
				className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
					currentLanguage === "en"
						? "bg-white/30 text-white"
						: "text-white/70 hover:bg-white/20"
				}`}
			>
				EN
			</button>
		</div>
	);
};
