export interface Friend {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    calories?: number;
    representative?: Representative;
}
export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}