import type { Quiz, QuizAnswer } from "./types";

const TRAITS = [
    { id: "age",            name: "Age",           description: "Age-related online experience" },
    { id: "class",          name: "Class",         description: "Economic access online" },
    { id: "language",       name: "Language",      description: "Language comfort online" },
    { id: "gender",         name: "Gender",        description: "Gender and online voice" },
    { id: "race_ethnicity", name: "Race/Ethnicity",description: "Representation online" },
    { id: "ability",        name: "Ability",       description: "Accessibility online" },
] as const;

const LIKERT_LABELS_FI = [
    "Täysin samaa mieltä",
    "Jokseenkin samaa mieltä",
    "Jokseenkin eri mieltä",
    "Täysin eri mieltä",
];

function likertAnswers(traitId: string): QuizAnswer[] {
    const scores = [3, 2, 1, 0];
    const labels = [
        "Completely agree",
        "Somewhat agree",
        "Somewhat disagree",
        "Completely disagree",
    ];
    return labels.map((label, i) => ({
        id: `${traitId}-opt-${i}`,
        label,
        labelFi: LIKERT_LABELS_FI[i],
        traitEffects: [{ traitId, value: scores[i]! }],
    }));
}

const dailyDataPrivileges: Quiz = {
    id: "daily-data-privileges",
    title: "Daily data privileges",
    titleFi: "Päivittäiset datan etuoikeudet",
    questions: [
        {
            id: "ddp-age-1",
            category: "age",
            prompt: "I am not targeted by scams because of my age.",
            promptFi: "En ole huijausten kohteena ikäni vuoksi.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class-1",
            category: "class",
            prompt: "I can afford a smartphone with enough storage for all the apps I need.",
            promptFi: "Minulla on varaa älypuhelimeen, jossa on riittävästi tallennustilaa kaikille tarvitsemilleni sovelluksille.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language-1",
            category: "language",
            prompt: "Most apps and websites are available in my language.",
            promptFi: "Useimmat sovellukset ja verkkosivut ovat saatavilla omalla kielelläni.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender-1",
            category: "gender",
            prompt: "My opinions online are rarely dismissed because of my gender.",
            promptFi: "Mielipiteitäni verkossa harvoin sivuutetaan sukupuoleni vuoksi.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race-1",
            category: "race_ethnicity",
            prompt: "I see people who look like me in social media ads and influencer content.",
            promptFi: "Näen itseni näköisiä ihmisiä sosiaalisen median mainoksissa ja vaikuttajasisällöissä.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability-1",
            category: "ability",
            prompt: "I can use most apps without assistive technology.",
            promptFi: "Pystyn käyttämään useimpia sovelluksia ilman avustavaa teknologiaa.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
        {
            id: "ddp-age-2",
            category: "age",
            prompt: "I can find online spaces for people my age easily.",
            promptFi: "Löydän helposti verkkoyhteisöjä omassa ikäryhmässäni.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class-2",
            category: "class",
            prompt: "I can replace my phone or laptop if it breaks.",
            promptFi: "Pystyn korvaamaan puhelimeni tai kannettavani, jos se hajoaa.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language-2",
            category: "language",
            prompt: "I do not worry that translations will make me sound strange.",
            promptFi: "En huoli, että käännökset saavat minut kuulostamaan oudolta.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender-2",
            category: "gender",
            prompt: "I do not fear gender-based threats in comment sections.",
            promptFi: "En pelkää sukupuoleen perustuvia uhkauksia kommenttiosioissa.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race-2",
            category: "race_ethnicity",
            prompt: "I do not worry that facial recognition will misidentify me.",
            promptFi: "En huoli, että kasvojentunnistus tunnistaa minut väärin.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability-2",
            category: "ability",
            prompt: "I can watch videos without needing captions.",
            promptFi: "Pystyn katsomaan videoita ilman tekstityksiä.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
        {
            id: "ddp-age-3",
            category: "age",
            prompt: "I am not excluded from platforms because of age restrictions.",
            promptFi: "Minua ei suljeta pois alustoilta ikärajoitusten vuoksi.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class-3",
            category: "class",
            prompt: "I can afford apps or tools that remove ads and tracking.",
            promptFi: "Minulla on varaa sovelluksiin tai työkaluihin, jotka poistavat mainokset ja seurannan.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language-3",
            category: "language",
            prompt: "I can participate in online communities without language barriers.",
            promptFi: "Pystyn osallistumaan verkkoyhteisöihin ilman kielimuureja.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender-3",
            category: "gender",
            prompt: "I am not stereotyped as “too emotional” when I post online.",
            promptFi: "Minua ei stereotypisoida ”liian tunteelliseksi”, kun julkaisen verkossa.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race-3",
            category: "race_ethnicity",
            prompt: "I rarely experience hate speech or racism online.",
            promptFi: "Kohtaan harvoin vihapuhetta tai rasismia verkossa.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability-3",
            category: "ability",
            prompt: "I can easily navigate public digital services.",
            promptFi: "Liikun helposti julkisissa digitaalisissa palveluissa.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
    ],
    resultLogic: {
        traits: [...TRAITS],
        determineResult: (scores: Record<string, number>): string => {
            const order = ["age", "class", "language", "gender", "race_ethnicity", "ability"];
            const scored = order.filter((id) => id in scores);
            if (scored.length === 0) return "unknown";
            return scored.reduce((min, id) =>
                (scores[id] ?? 0) < (scores[min] ?? 0) ? id : min
            );
        },
    },
};

export default dailyDataPrivileges;
