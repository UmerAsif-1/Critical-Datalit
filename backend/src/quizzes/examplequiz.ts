import type { Quiz } from "./types.js";

// TODO: Actually implement a quiz we defined and rename this to something meaningful
// TODO: If the question amount gets very large for a quiz we might want to break this object into separate files.
const example: Quiz = {
    id: "foo",
    title: "foobar",
    questions: [
        {
            id: "q1",
            prompt: "foo?",
            type: "single-choice",
            answers: [
                {
                    id: "a",
                    label: "BAR!",
                    traitEffects: [{ traitId: "FUBAR", value: 2 }]
                },
                {
                    id: "b",
                    label: "bar...",
                    traitEffects: [{ traitId: "foobar", value: 2 }]
                }
            ]
        },
        {
            id: "q1",
            prompt: "foo?",
            type: "single-choice",
            answers: [
                {
                    id: "a",
                    label: "BAR!",
                    traitEffects: [{ traitId: "FUBAR", value: 2 }]
                },
                {
                    id: "b",
                    label: "bar...",
                    traitEffects: [{ traitId: "foobar", value: 2 }]
                }
            ]
        }
    ],
    resultLogic: {
        traits: [
            { id: "FUBAR", name: "FUUBAR", description: "fooBAR!" },
            { id: "foobar", name: "_foobar_", description: "foobar..." }
        ],
        // Note, in this single question example we just get the highest value.
        // also, the scores are fetched from the db.
        determineResult: (scores: Record<string, number>): string => {
            const entries = Object.entries(scores);
            if (entries.length === 0) {
                return "unknown";
            }

            const [maxTrait] = entries.sort((a, b) => b[1] - a[1]);
            return maxTrait![0];
        }

    }
};

export default example;
