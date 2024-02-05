"use client";
import { useRef, useState } from "react";

function format(str) {
    return (str[0].toUpperCase() + str.slice(-str.length + 1)).replaceAll('_', ' ');
}

function WordForm({ form }) {
    return <div className="p-5 bg-neutral-100 outline outline-2 outline-neutral-200 rounded-2xl shadow-md">
        <p><strong>Part of speech:</strong> {format(form.part_of_speech)}</p>
        {form.casus !== undefined && <p><strong>Case:</strong> {format(form.casus)}</p>}
        {form.tense !== undefined && <p><strong>Tense:</strong> {format(form.tense)}</p>}
        {form.voice !== undefined && <p><strong>Voice:</strong> {format(form.voice)}</p>}
        {form.mood !== undefined && <p><strong>Mood:</strong> {format(form.mood)}</p>}
        {form.person !== undefined && <p><strong>Person:</strong> {form.person}</p>}
        {form.plural !== undefined && <p><strong>Plural:</strong> {form.plural ? "Yes" : "No"}</p>}
        {form.gender !== undefined && <p><strong>Gender:</strong> {format(form.gender)}</p>}
        <p><strong>English equivalent:</strong> {format(form.english_equivalent)}</p>
    </div>;
}

export default function Main() {
    const word = useRef("");
    const [forms, setForms] = useState([]);

    return <div className="flex flex-col gap-5 m-5 h-full">
        <form className="flex flex-row" onSubmit={async e => {
            e.preventDefault();

            const resp = await fetch("http://localhost:8000/word_info?" + new URLSearchParams({
                word: word.current,
            }));
            const variants = await resp.json();

            setForms([]);
            for (const variant of variants) {
                setForms(forms => {
                    return [...forms, ...variant.forms];
                });
            }
        }}>
            <input placeholder="Enter a word..." className="flex-1 min-w-0 text-center text-3xl bg-neutral-100 outline outline-2 outline-neutral-200 rounded-l-2xl" onChange={e => word.current = e.target.value}></input>
            <button type="submit" className="p-3 bg-green-500 outline outline-2 outline-green-600 rounded-r-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 p-2 text-white">
                    <path strokeLineCap="round" strokeLineJoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map(form => {
                return <WordForm form={form} />;
            })}
        </div>
    </div>;
}
