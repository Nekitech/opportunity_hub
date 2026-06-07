/** Canonical entity types shared between @repo/api and @repo/web */

export type Grant = {
    id: number;
    namePost: string;
    dateCreationPost: string | null;
    directions: string | null;
    organization: string | null;
    deadline: string | null;
    summary: string | null;
    directionForSpent: string | null;
    fullText: string | null;
    link: string | null;
    linkPDF: string | null;
    sourceLink: string | null;
    timeOfParse: string | null;
    blackListed: boolean;
    parser_id: number | null;
};

export type Competition = {
    id: number;
    namePost: string;
    dateCreationPost: string | null;
    directions: string | null;
    organization: string | null;
    deadline: string | null;
    summary: string | null;
    fullText: string | null;
    link: string | null;
    linkPDF: string | null;
    sourceLink: string | null;
    timeOfParse: string | null;
    blackListed: boolean;
    parser_id: number | null;
};

export type Internship = {
    id: number;
    namePost: string;
    dateCreationPost: string | null;
    directions: string | null;
    responsibilities: string | null;
    organization: string | null;
    fullText: string | null;
    link: string | null;
    linkPDF: string | null;
    sourceLink: string | null;
    timeOfParse: string | null;
    blackListed: boolean;
    parser_id: number | null;
};

export type Vacancy = {
    id: number;
    namePost: string;
    dateCreationPost: string | null;
    directions: string | null;
    organization: string | null;
    salary: string | null;
    responsibilities: string | null;
    fullText: string | null;
    link: string | null;
    linkPDF: string | null;
    sourceLink: string | null;
    timeOfParse: string | null;
    blackListed: boolean;
    parser_id: number | null;
};

export type Opportunity = Grant | Competition | Internship | Vacancy;

export type OpportunityType = "grant" | "competition" | "internship" | "vacancy";
