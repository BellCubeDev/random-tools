import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: 'Bell\'s Random Tools' },
};

export default function RedirectToFilesByHashPage() {


    return <article>
        <h1> Oh, welcome to me random tools! </h1>
        <p> This is a collection of random tools made by BellCube. Nothing particularly special! </p>
        <p> Check the nav bar above for the current tools! </p>
    </article>;
}
