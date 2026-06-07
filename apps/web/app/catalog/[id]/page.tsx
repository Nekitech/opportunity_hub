import type { Metadata } from "next";
import OpportunityDetailClient from "./OpportunityDetailClient";
import type { OpportunityKind } from "@/lib/api";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    return { title: `Возможность #${id} — Opportunity Hub` };
}

export default async function OpportunityDetailPage({ params }: { params: Params }) {
    const { id: rawParam } = await params;
    // id format: "grants-123" | "competitions-456" | "internships-789"
    const dashIdx = rawParam.lastIndexOf("-");
    const kind = rawParam.slice(0, dashIdx);
    const id = parseInt(rawParam.slice(dashIdx + 1), 10);

    if (!["grants", "competitions", "internships"].includes(kind) || isNaN(id)) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <p className="text-gray-500">Неверный идентификатор возможности.</p>
            </div>
        );
    }

    return <OpportunityDetailClient kind={kind as OpportunityKind} id={id} />;
}
