import type { Metadata } from "next";
import ZaneStatsCalculator from "./pageClient";

export const metadata: Metadata = {
    title: 'Zane Stats Calculator',
    description: "A stats calculator implemented for a DM named Zane",
};

export default function ZaneStatsCalculatorServer() {
    return <ZaneStatsCalculator />;
}
