export type UserInfoResp = {
    email: string;
    id: string;
    name: string;
    phone_number: string;
    pan_numbers: string[];
}

export type IPOStatusResp = {
    ipo_name: string;
    is_alloted: boolean;
    is_applied: boolean;
    pan_number: string;
    securities_alloted: string;
}