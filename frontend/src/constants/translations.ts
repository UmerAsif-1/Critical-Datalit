export type Language = "EN" | "FI";

export interface Translations {
    // MainView
    dailyDataPrivileges: string;
    enterSessionCode: string;
    enter6DigitCode: string;
    joinSession: string;
    or: string;
    createSession: string;
    enterValidCode: string;
    couldNotJoinSession: string;

    // InfoButton
    about: string;
    aboutParagraph1: string;
    aboutParagraph2: string;

    // JoinSession
    session: string;
    inThisSessionYouWill: string;
    start: string;

    // CreateSession
    createNewSession: string;
    sessionName: string;
    sessionNamePlaceholder: string;
    creating: string;
    couldNotCreateSession: string;

    // AdminView
    loadingSession: string;
    joinCode: string;
    participant: string;
    participants: string;
    filter: string;
    categoryAll: string;
    category: string;
    question: string;
    privilege: string;
    answers: string;
    previousQuestion: string;
    nextQuestion: string;
    averagePrivilegeLevels: string;
    joined: string;
    privilegeLevel: string;
    sessionTimeLeft: string;
    hLimit: string;
    downloadCsv: string;
    endSession: string;
    couldNotLoadAdminData: string;
    csvDownloadFailed: string;
    couldNotEndSession: string;
}

const EN: Translations = {
    dailyDataPrivileges: "Daily data privileges",
    enterSessionCode: "Enter Session Code",
    enter6DigitCode: "Enter 6-Digit Code",
    joinSession: "Join Session",
    or: "or",
    createSession: "Create Session",
    enterValidCode: "Enter a valid 6-digit code.",
    couldNotJoinSession: "Could not join session",

    about: "About",
    aboutParagraph1:
        "This app was created to educate youth about data privilege and data justice. Join a session, answer questions and see how privilege affects you.",
    aboutParagraph2:
        "You can return back to the quiz if the session is interrupted or the game window is closed.",

    session: "Session",
    inThisSessionYouWill:
        "In this session you will answer questions about data privilege and how it might affect you in different categories of life:",
    start: "Start",

    createNewSession: "Create New Session",
    sessionName: "Session Name",
    sessionNamePlaceholder: "e.g.. Class Quiz Feb 21 2026",
    creating: "Creating…",
    couldNotCreateSession: "Could not create session",

    loadingSession: "Loading session…",
    joinCode: "Join code: ",
    participant: "participant",
    participants: "participants",
    filter: "Filter",
    categoryAll: "Category: All",
    category: "Category: ",
    question: "Question: ",
    privilege: "privilege",
    answers: "answers",
    previousQuestion: "Previous question",
    nextQuestion: "Next question",
    averagePrivilegeLevels: "Average privilege levels",
    joined: "joined",
    privilegeLevel: "Privilege level",
    sessionTimeLeft: "Session time left: ",
    hLimit: "h limit",
    downloadCsv: "Download CSV",
    endSession: "End session",
    couldNotLoadAdminData: "Could not load admin data",
    csvDownloadFailed: "CSV download failed",
    couldNotEndSession: "Could not end session",
};

const FI: Translations = {
    dailyDataPrivileges: "Daily data privileges",
    enterSessionCode: "Syötä istunnon koodi",
    enter6DigitCode: "Syötä kuusinumeroinen koodi",
    joinSession: "Liity istuntoon",
    or: "tai",
    createSession: "Luo istunto",
    enterValidCode: "Syötä kelvollinen 6-numeroinen koodi.",
    couldNotJoinSession: "Et voinut liittyä istuntoon",

    about: "Tietoa",
    aboutParagraph1:
        "Tämä sovellus on luotu kouluttamaan nuoria dataetuoikeudesta ja -oikeudenmukaisuudesta. Liity istuntoon, vastaa kysymyksiin ja näe miten etuoikeus vaikuttaa sinuun.",
    aboutParagraph2:
        "Voit palata kyselyyn jos istunto keskeytyy tai peli-ikkuna sulkeutuu.",

    session: "Istunto",
    inThisSessionYouWill:
        "Tässä istunnossa vastaat kysymyksiin dataetuoikeudesta ja siitä, miten se voi vaikuttaa sinuun elämän eri aloilla:",
    start: "Aloita",

    createNewSession: "Luo uusi istunto",
    sessionName: "Istunnon nimi",
    sessionNamePlaceholder: "esim. Luokka Kysely Helmikuu 21. 2026",
    creating: "Luodaan…",
    couldNotCreateSession: "Istuntoa ei voitu luoda",
    loadingSession: "Ladataan istuntoa…",
    joinCode: "Liittymiskoodi: ",
    participant: "osallistuja",
    participants: "osallistujaa",
    filter: "Suodatin",
    categoryAll: "Kategoria: Kaikki",
    category: "Kategoria: ",
    question: "Kysymys: ",
    privilege: "etuoikeus",
    answers: "vastausta",
    previousQuestion: "Edellinen kysymys",
    nextQuestion: "Seuraava kysymys",
    averagePrivilegeLevels: "Keskimääräiset etuoikeustasot",
    joined: "liittyivät",
    privilegeLevel: "Etuoikeustaso",
    sessionTimeLeft: "Istunnon aikaa jäljellä: ",
    hLimit: "h rajoitus",
    downloadCsv: "Lataa CSV",
    endSession: "Lopeta istunto",
    couldNotLoadAdminData: "Ylläpitäjän tietoja ei voitu ladata",
    csvDownloadFailed: "CSV-lataus epäonnistui",
    couldNotEndSession: "Istuntoa ei voitu lopettaa",};

export const translations: Record<Language, Translations> = {
    EN,
    FI,
};

export function getTranslation(language: Language): Translations {
    return translations[language];
}
