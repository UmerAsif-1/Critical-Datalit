export interface SessionRow {
    id: string;
    join_code: string;
    admin_cookie: string;
    quiz_id: string;
    created_at: string;
    ended_at: string | null;
    [key: `question_${number}`]: number | null | undefined;
}

export interface GameRow {
    user_cookie: string;
    session_id: string;
    [key: `answer_${number}`]: number | null | undefined;
}