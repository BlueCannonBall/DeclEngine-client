"use client";
import { useRef, useState } from "react";

function format(str) {
    if (str.length === 1) {
        return str[0].toUpperCase();
    } else {
        return (str[0].toUpperCase() + str.slice(-str.length + 1)).replaceAll('_', ' ');
    }
}

function WordForm({ form }) {
    const bgColors = [
        "bg-blue-200",
        "bg-red-200",
        "bg-green-200",
        "bg-purple-200",
        "bg-cyan-200",
        "bg-orange-200",
        "bg-emerald-200",
        "bg-amber-200",
        "bg-sky-200",
        "bg-violet-200",
        "bg-teal-200",
    ];

    const outlineColors = [
        "outline-blue-300",
        "outline-red-300",
        "outline-green-300",
        "outline-purple-300",
        "outline-cyan-300",
        "outline-orange-300",
        "outline-emerald-300",
        "outline-amber-300",
        "outline-sky-300",
        "outline-violet-300",
        "outline-teal-300",
    ];

    const bgColor = bgColors[form.baseID % bgColors.length];
    const outlineColor = outlineColors[form.baseID % outlineColors.length];

    return <div className={`p-5 ${bgColor} outline outline-2 ${outlineColor} rounded-2xl`}>
        <p><strong>English base:</strong> {format(form.english_base)}</p>
        <p><strong>Part of speech:</strong> {format(form.part_of_speech)}</p>
        {form.casus !== undefined && <p><strong>Case:</strong> {format(form.casus)}</p>}
        {form.tense !== undefined && <p><strong>Tense:</strong> {format(form.tense)}</p>}
        {form.voice !== undefined && <p><strong>Voice:</strong> {format(form.voice)}</p>}
        {form.mood !== undefined && <p><strong>Mood:</strong> {format(form.mood)}</p>}
        {form.person !== undefined && <p><strong>Person:</strong> {form.person}</p>}
        {form.plural !== undefined && <p><strong>Plural:</strong> {form.plural ? "Yes" : "No"}</p>}
        {form.gender !== undefined && <p><strong>Gender:</strong> {format(form.gender)}</p>}
        {form.degree !== undefined && <p><strong>Degree:</strong> {format(form.degree)}</p>}
        {form.type !== undefined && <p><strong>Type:</strong> {format(form.type)}</p>}
        <p><strong>English equivalent:</strong> {format(form.english_equivalent)}</p>
    </div>;
}

export default function Main() {
    const word = useRef("");
    const [forms, setForms] = useState([]);

    const handleSubmit = async e => {
        e.preventDefault();

        const resp = await fetch("http://192.168.1.248:8000/word_info?" + new URLSearchParams({
            word: word.current,
        }));
        if (resp.status != 200) {
            alert("Word not found.");
            return;
        }
        const variants = await resp.json();

        setForms([]);
        for (const i in variants) {
            for (const form of variants[i].forms) {
                form.baseID = i;
                form.english_base = variants[i].english_base;
            }
            setForms(forms => {
                return [...forms, ...variants[i].forms];
            });
        }
    };

    return <main className="flex flex-col gap-5 m-5">
        <form className="flex flex-row" onSubmit={handleSubmit}>
            <input placeholder="Enter a word..." className="flex-1 min-w-0 text-center text-3xl bg-neutral-100 outline outline-2 outline-neutral-200 rounded-l-2xl" onChange={e => word.current = e.target.value}></input>
            <button type="submit" className="p-3 bg-green-500 outline outline-2 outline-green-600 rounded-r-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 p-2 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </form>
        {forms.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form, i) => {
                return <WordForm form={form} key={i} />;
            })}
        </div> : <div className="text-center">
            <p>Word forms appear here.</p>
        </div>}
    </main>;
}
