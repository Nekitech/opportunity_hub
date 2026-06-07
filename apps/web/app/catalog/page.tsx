import type { Metadata } from "next";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import SearchBar from "@/components/catalog/SearchBar";
import SortSelect from "@/components/catalog/SortSelect";

export const metadata: Metadata = {
    title: "Каталог возможностей — Opportunity Hub",
    description: "Гранты, конкурсы и стажировки из 50+ источников",
};

export default function CatalogPage() {
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Каталог возможностей
                </h1>
                <p className="mt-1 text-gray-500">
                    Гранты, конкурсы и стажировки из 50+ источников. Обновляется автоматически.
                </p>
            </header>

            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <CatalogFilters />

                <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="min-w-0 flex-1">
                            <SearchBar />
                        </div>
                        <SortSelect />
                    </div>
                    <CatalogGrid />
                </div>
            </div>
        </div>
    );
}
