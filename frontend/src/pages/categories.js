import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/categories.module.css";
const categories = [
	{
		name: "Information Technology",
		query: "IT",
		icon: "💻",
		openRoles: "8 open roles",
		summary: "8 jobs · 4 internships",
		tags: ["React", "Python", "AWS", "DevOps"],
		buttonText: "View IT Jobs",
		headerClass: "from-blue-700 to-blue-500",
		chipClass: "bg-blue-100 text-blue-700",
		buttonClass: "bg-blue-700 hover:bg-blue-800",
		gridClass: "lg:col-span-2",
	},
	{
		name: "Marketing",
		query: "Marketing",
		icon: "📢",
		openRoles: "5 open roles",
		summary: "5 jobs · 3 internships",
		tags: ["SEO", "Content", "Social Media"],
		buttonText: "View Marketing Jobs",
		headerClass: "from-blue-800 to-blue-600",
		chipClass: "bg-blue-100 text-blue-700",
		buttonClass: "bg-blue-800 hover:bg-blue-900",
		gridClass: "lg:col-span-2",
	},
	{
		name: "Finance",
		query: "Finance",
		icon: "📊",
		openRoles: "3 open roles",
		summary: "3 jobs · 1 internship",
		tags: ["Accounting", "Excel", "Analysis"],
		buttonText: "View Finance Jobs",
		headerClass: "from-sky-700 to-blue-600",
		chipClass: "bg-sky-100 text-sky-700",
		buttonClass: "bg-sky-700 hover:bg-sky-800",
		gridClass: "lg:col-span-2",
	},
	{
		name: "Design & Creative",
		query: "Design",
		icon: "🎨",
		openRoles: "4 open roles",
		summary: "4 jobs · 2 internships",
		tags: ["Figma", "UI/UX", "Illustrator", "Branding", "Motion"],
		buttonText: "View Design Jobs",
		headerClass: "from-blue-700 to-indigo-700",
		chipClass: "bg-indigo-100 text-indigo-700",
		buttonClass: "bg-indigo-700 hover:bg-indigo-800",
		gridClass: "lg:col-span-2",
	},
	{
		name: "Engineering",
		query: "Engineering",
		icon: "⚙️",
		openRoles: "6 open roles",
		summary: "6 jobs · 2 internships",
		tags: ["Civil", "Electrical", "Mechanical"],
		buttonText: "View Engineering Jobs",
		headerClass: "from-blue-900 to-blue-700",
		chipClass: "bg-blue-100 text-blue-700",
		buttonClass: "bg-blue-900 hover:bg-blue-950",
		gridClass: "lg:col-span-2",
	},
];

export default function CategoriesPage() {
	useEffect(() => {
		document.title = "Categories | CareerBridge";
	}, []);

	return (
		<>


			<div className={styles.page}>
				<div className="min-h-screen bg-skyBrand-50 text-slate-900">
					<Navbar variant="hero" />

				<main className="mx-auto max-w-7xl px-4 pb-16 pt-10 lg:px-8">
					<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
						{categories.map((category) => {
							return (
								<Link
									key={category.name}
									to={`/opportunities?category=${category.query}`}
									className={`group overflow-hidden rounded-3xl border border-sky-200 bg-slate-50 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-card ${category.gridClass}`}
								>
									<div className={`relative h-20 bg-gradient-to-r ${category.headerClass} p-3 sm:h-24 sm:p-4`}>
										<span className="inline-flex rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
											{category.openRoles}
										</span>
										<span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/35 bg-white/15 text-lg sm:h-11 sm:w-11 sm:text-xl">
											{category.icon}
										</span>
										<span className="absolute -bottom-3 left-5 h-12 w-12 rounded-full bg-white/12" />
									</div>

									<div className="p-4 sm:p-5">
										<p className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{category.name}</p>
										<p className="mt-1 text-sm text-slate-400 sm:text-base">• {category.summary}</p>

										<div className="mt-3 flex flex-wrap gap-1.5">
											{category.tags.map((tag) => (
												<span
													key={tag}
													className={`rounded-md px-2 py-1 text-xs font-semibold ${category.chipClass}`}
												>
													{tag}
												</span>
											))}
										</div>

										<div className="mt-4">
											<span
												className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold text-white transition ${category.buttonClass}`}
											>
												{category.buttonText} <span className="ml-2">→</span>
											</span>
										</div>
									</div>
								</Link>
							);
						})}
					</section>
				</main>

					<Footer />
				</div>
			</div>
		</>
	);
}
